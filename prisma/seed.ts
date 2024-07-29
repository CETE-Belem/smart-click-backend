import { PrismaClient } from '@prisma/client';
import { generateSalt, hashPassword } from '../src/services/libs/bcrypt';
import { fakerPT_BR } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  const passwordSalt = await generateSalt();
  const password = await hashPassword('@Abc1234', passwordSalt);

  await prisma.usuario
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
    });

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
