import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type NewsDocument = News & Document;

@Schema({
  collection: 'news',
  timestamps: true,
})
export class News {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  subtitulo: string;

  @Prop({ required: true })
  imagem: string; // base64

  @Prop({ required: true })
  dataPublicacao: Date;

  @Prop({ required: true })
  link: string;

  @Prop({ required: true })
  veiculoMidia: string;

  @Prop({ default: true })
  ativo: boolean;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  usuarioCadastro: Types.ObjectId;

  @Prop({ default: Date.now })
  dataCadastro: Date;

  @Prop({ default: 0 })
  cliques: number;
}

export const NewsSchema = SchemaFactory.createForClass(News);
