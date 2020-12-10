import { IsString, Length } from "class-validator";

export abstract class BookRequest {

  @IsString()
  @Length(1, 20)
  title!: string;
}