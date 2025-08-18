import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ModuleDocument = Module & Document;

@Schema({
  collection: 'modules',
  timestamps: true,
})
export class Module {
  @Prop({ required: true, unique: true })
  titulo: string;

  @Prop({ required: false })
  url?: string;
}

export const ModuleSchema = SchemaFactory.createForClass(Module);
