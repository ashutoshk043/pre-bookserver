import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class userProfileResponce {

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  state?: string;

  @Field({ nullable: true })
  district?: string;

  @Field({ nullable: true })
  block?: string;

  @Field({ nullable: true })
  village?: string;

  @Field({ nullable: true })
  roleId?: string;

  @Field({ nullable: true })
  profile?: string;

  @Field({ nullable: true })
  status?: string;
}
