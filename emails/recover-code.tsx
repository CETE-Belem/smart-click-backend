import { Html, Container, Heading, Text } from '@react-email/components';
import * as React from 'react';

export default function RecoverCode({ recoverCode }: { recoverCode: string }) {
  return (
    <Html>
      <Container
        style={{
          backgroundColor: 'black',
          borderRadius: '8px',
          padding: '12px',
        }}
      >
        <Heading
          style={{
            fontSize: '48px',
            fontWeight: 'bold',
            color: ' white',
            textAlign: 'center',
          }}
        >
          {recoverCode}
        </Heading>
        <Text
          style={{
            color: 'white',
          }}
        >
          Esse código é válido por apenas 15 minutos
        </Text>
      </Container>
    </Html>
  );
}

RecoverCode.PreviewProps = {
  recoverCode: '0A0C3B',
};
