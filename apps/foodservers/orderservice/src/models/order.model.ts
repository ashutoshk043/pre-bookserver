import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";
import { ObjectType, Field, ID, Float } from "@nestjs/graphql";

// ----------------------
// Order Item Subdocument
// ----------------------
@ObjectType({ description: 'Represents a single item in an order' })
class OrderItem {
    @Field({ description: 'Name of the dish/item' })
    @Prop({ required: true })
    itemName: string;

    @Field({ description: 'Quantity of this item ordered' })
    @Prop({ required: true })
    quantity: number;

    @Field(() => Float, { description: 'Price per unit of this item' })
    @Prop({ required: true })
    price: number;
}

// ----------------------
// Main Order Schema
// ----------------------
@Schema({ timestamps: true })
@ObjectType({ description: 'Represents an order, can be dine-in or online' })
export class Order extends Document {
    @Field(() => ID, { description: 'Unique ID of the order' })
    declare readonly _id: string;

    // Customer info
    @Prop()
    @Field({ nullable: true, description: 'Name of the customer (optional for dine-in)' })
    customerName?: string;

    @Prop()
    @Field({ nullable: true, description: 'Customer contact number (required for online orders)' })
    customerPhone?: string;

    @Prop()
    @Field({ nullable: true, description: 'Delivery address (required for online orders)' })
    customerAddress?: string;

    // Order type
    @Prop({ required: true, enum: ['online', 'dine-in'] })
    @Field({ description: 'Type of order: online or dine-in' })
    orderType: string;

    // Order items
    @Prop({ type: [OrderItem], required: true })
    @Field(() => [OrderItem], { description: 'List of items in the order' })
    items: OrderItem[];

    @Prop({ required: true })
    @Field(() => Float, { description: 'Total price of the order, sum of all items' })
    totalPrice: number;

    @Prop({ nullable: true })
    @Field({ nullable: true, description: 'Special instructions for the order (optional)' })
    specialInstructions?: string;

    // Dine-in specific
    @Prop()
    @Field({ nullable: true, description: 'Table number (required only for dine-in orders)' })
    tableNumber?: string;

    // Status
    @Prop({ default: 'pending', enum: ['pending', 'preparing', 'ready', 'served', 'cancelled'] })
    @Field({ description: 'Dine-in order status' })
    dineInStatus?: string;

    @Prop({ default: 'pending', enum: ['pending', 'accepted', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'] })
    @Field({ description: 'Online order status' })
    onlineStatus?: string;

    // Order time
    @Prop()
    @Field({ description: 'Time when the order was placed' })
    orderTime: Date;
} 

export const OrderSchema = SchemaFactory.createForClass(Order);
