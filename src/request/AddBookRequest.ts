import { IsString, Length } from "class-validator";

export class AddBookRequest {

  @IsString()
  @Length(1, 20)
  title!: string;
}