import { PrismaClient } from '@prisma/client';
import { generateSalt, hashPassword } from '../src/services/libs/bcrypt';
import { fakerPT_BR } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const passwordSalt = await generateSalt();
  const password = await hashPassword('@Abc1234', passwordSalt);

  const adm = await prisma.usuario
    .upsert({
      where: { email: 'rianernesto9@gmail.com' },
      update: {},
      create: {
        email: 'rianernesto9@gmail.com',
        nome: 'Rian Ernesto',
        senha: password,
        senhaSalt: passwordSalt,
        contaConfirmada: true,
        perfil: 'ADMIN',
      },
    })
    .then((response) => {
      console.log(`Admin ${response.email} criado`);
      return response;
    });
  const userCount = await prisma.usuario.count();

  if (userCount < 10) {
    for (const i in Array.from({ length: 10 })) {
      await prisma.usuario
        .upsert({
          where: { email: fakerPT_BR.internet.email() },
          update: {},
          create: {
            email: fakerPT_BR.internet.email({
              provider: 'amazontech.com.br',
            }),
            nome: fakerPT_BR.person.fullName(),
            senha: password,
            senhaSalt: passwordSalt,
            perfil: 'USUARIO',
          },
        })
        .then((response) => {
          console.log(`Usuário ${response.email} criado`);
        });
    }
  }

  for (const i in Array.from({ length: 3 })) {
    await prisma.concessionaria
      .create({
        data: {
          nome: fakerPT_BR.company.name(),
          cidade: fakerPT_BR.location.city(),
          uf: fakerPT_BR.location.state({ abbreviated: true }),
          criador: {
            connect: {
              cod_usuario: adm.cod_usuario,
            },
          },
        },
      })
      .then((response) => {
        console.log(`Concessionária ${response.nome} criada`);
      });
  }

  const concessionaria = await prisma.concessionaria.findFirst();

  for (const i in Array.from({ length: 3 })) {
    await prisma.unidade_Consumidora
      .create({
        data: {
          cidade: fakerPT_BR.location.city(),
          uf: fakerPT_BR.location.state({ abbreviated: true }),
          numero: fakerPT_BR.helpers.fromRegExp(/[0-9]{8}/),
          criador: {
            connect: {
              cod_usuario: adm.cod_usuario,
            },
          },
          concessionaria: {
            connect: {
              cod_concessionaria: concessionaria.cod_concessionaria,
            },
          },
        },
      })
      .then((response) => {
        console.log(`Concessionária da cidade ${response.cidade} criada`);
      });
  }
}

if (process.env.NODE_ENV !== 'production') {
  main()
    .then(async () => {
      await prisma.$disconnect();
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      process.exit(1);
    });
}
