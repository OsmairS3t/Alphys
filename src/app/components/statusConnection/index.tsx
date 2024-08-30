import { useEffect, useState, useRef } from "react";
import { useNetInfo } from '@react-native-community/netinfo';
import * as Animatable from 'react-native-animatable';

import {
  ContainerNetInfo,
  NetInfo,
  IconNetInfo,
  TextNetInfo
} from '../../styles/global'

export default function StatusConnection() {
  const netInfo = useNetInfo();
  const [color, setColor] = useState('#c9fcd4')
  const [isConnected, setIsConnected] = useState(true);
  const [messageConnection, setMessageConnection] = useState('Wifi Conectado');
  const component = useRef<any>(null);

  useEffect(() => {
    if (netInfo.isConnected) {
      setMessageConnection('Conectada!');
      setIsConnected(true)
      setColor('#c9fcd4')
      component.current.fadeOut(5000);
    } else {
      setMessageConnection('Desconectado!');
      setIsConnected(false)
      setColor('#ffc7c7')
      component.current.slideInDown();
    }
  }, [netInfo]);

  return (
    <ContainerNetInfo>
      <Animatable.View ref={component}>
        <NetInfo color={color}>
          <IconNetInfo name={isConnected ? 'wifi' : 'wifi-off'} />
          <TextNetInfo>{messageConnection}</TextNetInfo>
        </NetInfo>
      </Animatable.View>
    </ContainerNetInfo>
  )
}