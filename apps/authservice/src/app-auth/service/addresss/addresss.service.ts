import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { UserAddress, UserAddressDocument } from '../../schemas/user-address.model';
import { AddressInput } from '../../dtos/address.input';

// Plain object shape returned by .lean() — no Mongoose Document overhead
type LeanAddress = Omit<UserAddressDocument, keyof Document> & {
  _id: Types.ObjectId;
  __v?: number;
};

@Injectable()
export class AddressService {

  constructor(
    @InjectModel(UserAddress.name, 'usersConnection')
    private readonly addressModel: Model<UserAddressDocument>,
  ) {}

  // ─── Get all ──────────────────────────────────────────────

  async getUserAddresses(userId: string): Promise<LeanAddress[]> {
    return this.addressModel
      .find({ userId: new Types.ObjectId(userId) })
      .sort({ isDefault: -1, createdAt: -1 })
      .lean<LeanAddress[]>()
      .exec();
  }

  // ─── Get one ──────────────────────────────────────────────

  async getAddressById(id: string, userId: string): Promise<LeanAddress> {
    const address = await this.addressModel
      .findOne({ _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId) })
      .lean<LeanAddress>()
      .exec();

    if (!address) throw new NotFoundException('Address not found');
    return address;
  }

  // ─── Add ──────────────────────────────────────────────────

async addAddress(userId: string, input: AddressInput): Promise<UserAddressDocument> {
  // If this is set as default, clear existing default address
  if (input.isDefault) {
    await this.addressModel.updateMany(
      { userId: new Types.ObjectId(userId), isDefault: true },
      { $set: { isDefault: false } }
    );
  }

  // Count existing addresses for this user
  const count = await this.addressModel.countDocuments({ 
    userId: new Types.ObjectId(userId) 
  });

  // Create the address document with nested structure
  const addressData = {
    userId: new Types.ObjectId(userId),
    label: input.label || 'home',
    addressLine1: input.addressLine1,
    addressLine2: input.addressLine2 || '',
    landmark: input.landmark || '',
    city: input.city,
    state: input.state,
    pincode: input.pincode,
    isDefault: input.isDefault ?? count === 0, // First address becomes default if not specified
    contactInfo: {
      name: input.contactInfo.name,
      phone: input.contactInfo.phone,
    },
    location: input.location ? {
      lat: input.location.lat,
      lng: input.location.lng,
    } : undefined,
  };

  const doc = new this.addressModel(addressData);
  return await doc.save();
}


  // ─── Update ───────────────────────────────────────────────

  async updateAddress(id: string, userId: string, input: AddressInput): Promise<LeanAddress> {
    // Ownership check — intentionally NOT lean so we can read isDefault
    const existing = await this.addressModel.findOne({
      _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId),
    });
    if (!existing) throw new NotFoundException('Address not found');

    if (input.isDefault && !existing.isDefault) await this._clearDefault(userId);

    const updated = await this.addressModel
      .findByIdAndUpdate(new Types.ObjectId(id), { $set: input }, { new: true })
      .lean<LeanAddress>()
      .exec();

    if (!updated) throw new NotFoundException('Address not found after update');
    return updated;
  }

  // ─── Delete ───────────────────────────────────────────────

  async deleteAddress(id: string, userId: string): Promise<{ success: boolean; message: string }> {
    const address = await this.addressModel.findOne({
      _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId),
    });
    if (!address) throw new NotFoundException('Address not found');

    const wasDefault = address.isDefault;
    await this.addressModel.findByIdAndDelete(new Types.ObjectId(id));

    if (wasDefault) await this._promoteNext(userId);

    return { success: true, message: 'Address deleted' };
  }

  // ─── Set default ──────────────────────────────────────────

  async setDefaultAddress(id: string, userId: string): Promise<LeanAddress> {
    const exists = await this.addressModel.findOne({
      _id: new Types.ObjectId(id), userId: new Types.ObjectId(userId),
    });
    if (!exists) throw new NotFoundException('Address not found');

    await this._clearDefault(userId);

    const updated = await this.addressModel
      .findByIdAndUpdate(new Types.ObjectId(id), { $set: { isDefault: true } }, { new: true })
      .lean<LeanAddress>()
      .exec();

    if (!updated) throw new NotFoundException('Address not found after update');
    return updated;
  }

  // ─── Used by OrderService to validate address at checkout ─

  async validateOwnership(addressId: string, userId: string): Promise<LeanAddress> {
    const address = await this.addressModel
      .findOne({ _id: new Types.ObjectId(addressId), userId: new Types.ObjectId(userId) })
      .lean<LeanAddress>()
      .exec();
    if (!address) throw new NotFoundException('Address not found or access denied');
    return address;
  }

  // ─── Private helpers ──────────────────────────────────────

  private async _clearDefault(userId: string): Promise<void> {
    await this.addressModel.updateMany(
      { userId: new Types.ObjectId(userId), isDefault: true },
      { $set: { isDefault: false } },
    );
  }

  private async _promoteNext(userId: string): Promise<void> {
    const next = await this.addressModel
      .findOne({ userId: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
    if (next) await this.addressModel.findByIdAndUpdate(next._id, { $set: { isDefault: true } });
  }
}