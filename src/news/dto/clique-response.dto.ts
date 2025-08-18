import { ApiProperty } from '@nestjs/swagger';

export class CliqueResponseDto {
  @ApiProperty({
    description: 'Mensagem de confirmação',
    example: 'Clique contabilizado com sucesso',
  })
  message: string;

  @ApiProperty({
    description: 'Total de cliques da notícia após incremento',
    example: 42,
  })
  cliques: number;
}
