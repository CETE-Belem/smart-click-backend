import { Dado_Sensor, PrismaClient } from '@prisma/client';
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

  const adm2 = await prisma.usuario
    .upsert({
      where: { email: 'andrecorreasidrim@gmail.com' },
      update: {},
      create: {
        email: 'andrecorreasidrim@gmail.com',
        nome: 'André Sidrim',
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
          subgrupo: 'B1',
          optanteTB: true,
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

  const consumerUnit = await prisma.unidade_Consumidora.findFirst();

  const equipment = await prisma.equipamento.create({
    data: {
      nome: fakerPT_BR.commerce.productName(),
      fases_monitoradas: 'TRIFASE',
      tensao_nominal: 220,
      cidade: fakerPT_BR.location.city(),
      uf: fakerPT_BR.location.state({ abbreviated: true }),
      mac: fakerPT_BR.internet.mac(),
      usuario_cadastrou: {
        connect: {
          cod_usuario: adm.cod_usuario,
        },
      },
      unidade_consumidora: {
        connect: {
          cod_unidade_consumidora: consumerUnit.cod_unidade_consumidora,
        },
      },
    },
  });

  console.log(`Equipamento ${equipment.nome} criado`);

  const sensorData = Array.from({ length: 5000 }).map(() => {
    return {
      data: fakerPT_BR.date.recent({ days: 1460 }),
      cod_equipamento: equipment.cod_equipamento,
      vA: fakerPT_BR.number.float({ min: 0, max: 300, precision: 2 }),
      iA: fakerPT_BR.number.float({ min: -100, max: 100, precision: 2 }),
      FPA: fakerPT_BR.number.float({ min: 0, max: 1, precision: 2 }),
      potenciaAtivaA: fakerPT_BR.number.float({
        min: 0,
        max: 300,
        precision: 2,
      }),
      potenciaAparenteA: fakerPT_BR.number.float({
        min: 0,
        max: 300,
        precision: 2,
      }),
      vB: fakerPT_BR.number.float({ min: 0, max: 300, precision: 2 }),
      iB: fakerPT_BR.number.float({ min: -100, max: 100, precision: 2 }),
      FPB: fakerPT_BR.number.float({ min: 0, max: 1, precision: 2 }),
      potenciaAtivaB: fakerPT_BR.number.float({
        min: 0,
        max: 300,
        precision: 2,
      }),
      potenciaAparenteB: fakerPT_BR.number.float({
        min: 0,
        max: 300,
        precision: 2,
      }),
      vC: fakerPT_BR.number.float({ min: 0, max: 300, precision: 2 }),
      iC: fakerPT_BR.number.float({ min: -100, max: 100, precision: 2 }),
      FPC: fakerPT_BR.number.float({ min: 0, max: 1, precision: 2 }),
      potenciaAtivaC: fakerPT_BR.number.float({
        min: 0,
        max: 300,
        precision: 2,
      }),
      potenciaAparenteC: fakerPT_BR.number.float({
        min: 0,
        max: 300,
        precision: 2,
      }),
    } as Dado_Sensor;
  });

  await prisma.dado_Sensor.createMany({
    data: sensorData,
  });
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
