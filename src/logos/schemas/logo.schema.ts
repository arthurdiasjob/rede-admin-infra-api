import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LogoDocument = Logo & Document;

@Schema({
  collection: 'logos',
  timestamps: true,
})
export class Logo {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  imagem: string; // base64

  @Prop({ required: false })
  url?: string;
}

export const LogoSchema = SchemaFactory.createForClass(Logo);
