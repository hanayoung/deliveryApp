import {useCallback} from 'react';
import {io, Socket} from 'socket.io-client';
import Config from 'react-native-config';

let socket: Socket | undefined; //useSocket 파일에서 전역변수

const useSocket = (): [Socket | undefined, () => void] => { //첫 번째 값이 socket의 타입이므로 Socket|undefined 부분을 typeof Socket도 가능, 두 번째 값은 disconnect 함수의 타입이므로, 매개변수 없이 return 값이 없는 함수이므로 () => void
  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = undefined;
    }
  }, []);
  if (!socket) { // useSocket이 불릴 때마다 웹소켓 연결이 한 번만 되도록하기 위해
    socket = io(`${Config.API_URL}`, {
      transports: ['websocket'],
    });
  }
  return [socket, disconnect];
};

export default useSocket;