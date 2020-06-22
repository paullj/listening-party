import { Field, InputType } from 'type-graphql';
import { Track } from '../entity/Track';

@InputType()
class AddTrackInput implements Partial<Track> {
  @Field()
  title!: string;

  @Field()
  artist!: string;

  @Field({ nullable: true })
  album?: string;

  @Field({ nullable: true })
  albumCover?: string;

  @Field({ nullable: true })
  duration?: number;

  @Field({ nullable: true })
  provider?: string;

  @Field({ nullable: true })
  providerId?: string;
}

export { AddTrackInput };
