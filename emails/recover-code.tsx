import {
  Html,
  Text,
  Body,
  Column,
  Font,
  Head,
  Img,
  Preview,
  Row,
  Section,
} from '@react-email/components';
import * as React from 'react';
import confirmationCode from './confirmation-code';

export default function RecoverCode({ recoverCode }: { recoverCode: string }) {
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
      <Preview>Smart Click - Recupere sua senha</Preview>
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
            Seu Código de{' '}
            <span style={{ color: '#1C5790' }}>Recuperação de Senha</span>
          </Text>
          <Text
            style={{
              padding: 0,
              margin: '20px 0',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            <span style={{ color: '#1C5790', fontWeight: 'bold' }}>Olá!</span>{' '}
            Este é o seu código de recuperação. Digite-o na janela do navegador
            para que possamos ajudar você a recuperar sua senha.
          </Text>
        </Section>
        <Section
          style={{
            textAlign: 'center',
            padding: '41px 0',
            width: '100%',
            borderRadius: '11px',
            border: '1px solid rgba(0,0,0,0.2)',
          }}
        >
          <Text style={{ fontSize: '32px', fontWeight: 'bold' }}>
            {recoverCode}
          </Text>
        </Section>
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
            <span
              style={{
                color: '#333',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 'normal',
              }}
            >
              Importante:
            </span>{' '}
            Este código de confirmação é válido por{' '}
            <span
              style={{
                color: '#333',
                fontFamily: 'Inter',
                fontSize: '14px',
                fontStyle: 'normal',
                fontWeight: 700,
                lineHeight: 'normal',
              }}
            >
              15 minutos
            </span>
            . Após esse período, será necessário solicitar um novo código.
          </Text>
          <Text
            style={{
              padding: 0,
              margin: '20px 0',
              color: 'rgba(51, 51, 51, 0.74)',
              fontSize: '14px',
              fontStyle: 'normal',
              fontWeight: 500,
              lineHeight: 'normal',
            }}
          >
            Se você não solicitou este código, por favor, ignore este e-mail.
          </Text>
        </Section>
      </Body>
    </Html>
  );
}

RecoverCode.PreviewProps = {
  recoverCode: '0A0C3B',
};
