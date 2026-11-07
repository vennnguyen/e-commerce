import { Transform } from 'class-transformer';
import { IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class SuggestProductDto {
  @IsString()
  query: string;

  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === null || value === undefined
      ? undefined
      : Number(value),
  )
  @IsNumber({}, { message: 'size phải là số' })
  @Min(1)
  @Max(10)
  size?: number = 5;
}
