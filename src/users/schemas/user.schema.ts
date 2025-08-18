import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type UserDocument = User & Document;

export interface UserModule {
  moduleId: string;
  titulo: string;
  ativo: boolean;
}

@Schema({
  collection: 'users',
  timestamps: true,
})
export class User {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  senha: string;

  @Prop({
    type: [
      {
        moduleId: { type: Types.ObjectId, ref: 'Module' },
        titulo: String,
        ativo: { type: Boolean, default: true },
      },
    ],
    default: [],
  })
  modulos: UserModule[];
}

export const UserSchema = SchemaFactory.createForClass(User);
