import {
  Body,
  Column,
  Head,
  Html,
  Img,
  Preview,
  Row,
  Section,
  Text,
  Font,
} from '@react-email/components';
import dayjs from 'dayjs';
import * as React from 'react';

export default function EnergyReport({
  valueTB,
  valueConv,
  from,
  to,
  optanteTB,
  equipmentName,
}: {
  valueTB: number;
  valueConv: number;
  from: Date;
  to: Date;
  optanteTB: boolean;
  equipmentName: string;
}) {
  return (
    <Html
      style={{
        backgroundColor: 'white',
        padding: '110px 30px',
        borderRadius: '8px',
        display: 'flex',
      }}
    >
      <Head>
        <Font
          fontFamily="Inter"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuGKYAZ9hiJ-Ek-_EeA.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Smart Click - Seu Relatório de energia está disponível</Preview>
      <Body style={{ color: '#333333', width: '100%' }}>
        <Section>
          <Row>
            <Column>
              <Img
                src={`https://smartclick.zenithinova.com.br/_next/static/media/colored-logo.95fa9577.svg`}
                width="80"
                height="80"
                alt="Smart Click Logo"
              />
            </Column>
          </Row>
        </Section>
        <Section>
          <Text
            style={{
              padding: 0,
              margin: '20px 0',
              fontSize: '32px',
              fontWeight: 'bold',
            }}
          >
            Relatório de energia do equipamento {equipmentName}
          </Text>
          <Text
            style={{
              padding: 0,
              margin: '20px 0',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            ({dayjs(from).format('DD/MM/YYYY')} {' - '}{' '}
            {dayjs(to).format('DD/MM/YYYY')})
          </Text>
          <Text
            style={{
              padding: 0,
              margin: '20px 0',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {optanteTB && (
              <p>
                O consumo do seu equipamento na tarifa branca foi de{' '}
                <span style={{ color: '#1C5790', fontWeight: 'bold' }}>
                  R${valueTB.toFixed(2)}
                </span>
              </p>
            )}
            <p>
              O consumo do seu equipamento na tarifa convencional foi de{' '}
              <span style={{ color: '#1C5790', fontWeight: 'bold' }}>
                R${valueConv.toFixed(2)}
              </span>
            </p>
          </Text>
        </Section>
        {optanteTB && (
          <Section>
            <Text
              style={{
                padding: 0,
                margin: '20px 0',
                fontSize: '14px',
                fontWeight: '500',
                color: '#333',
                fontFamily: 'Inter',
                fontStyle: 'normal',
                lineHeight: 'normal',
              }}
            >
              {valueTB > valueConv ? (
                <p>
                  Parabéns! Você economizou{' '}
                  <span style={{ color: '#1C5790', fontWeight: 'bold' }}>
                    R${(valueTB - valueConv).toFixed(2)}
                  </span>{' '}
                  na tarifa branca.
                </p>
              ) : (
                <p>
                  Você economizaria{' '}
                  <span style={{ color: '#1C5790', fontWeight: 'bold' }}>
                    R${(valueConv - valueTB).toFixed(2)}
                  </span>{' '}
                  na tarifa branca.
                </p>
              )}
            </Text>
          </Section>
        )}
      </Body>
    </Html>
  );
}

EnergyReport.PreviewProps = {
  valueTB: 532.54,
  valueConv: 602.95,
  from: dayjs().startOf('month').toDate(),
  to: dayjs().endOf('month').toDate(),
  optanteTB: true,
  equipmentName: 'Ar condicionado',
};
