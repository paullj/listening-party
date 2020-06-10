import { Field, InputType } from 'type-graphql';
import { Party } from '../entity/Party';

@InputType()
class CreatePartyInput implements Partial<Party> {
  @Field()
  name!: string;

  @Field({ nullable: true })
  isPublic?: boolean;
}

export { CreatePartyInput };
