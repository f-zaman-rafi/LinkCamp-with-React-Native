import React, { createContext, useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Modal, Platform, Text, TouchableOpacity, View } from 'react-native';

type AlertButton = {
  text?: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertState = {
  title?: string;
  message?: string;
  buttons: AlertButton[];
} | null;

const WebAlertContext = createContext<{
  show: (t?: string, m?: string, b?: AlertButton[]) => void;
} | null>(null);

export const WebAlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>(null);
  const originalRef = useRef(Alert.alert);

  const show = useCallback((title?: string, message?: string, buttons?: AlertButton[]) => {
    const list = buttons?.length ? buttons : [{ text: 'OK' }];
    setAlert({ title, message, buttons: list });
  }, []);

  const close = useCallback(() => setAlert(null), []);

  useEffect(() => {
    if (Platform.OS !== 'web') return;
    (Alert as any).alert = (title?: string, message?: string, buttons?: AlertButton[]) =>
      show(title, message, buttons);
    return () => {
      (Alert as any).alert = originalRef.current;
    };
  }, [show]);

  return (
    <WebAlertContext.Provider value={{ show }}>
      {children}

      {Platform.OS === 'web' && (
        <Modal
          visible={!!alert}
          transparent
          animationType="fade"
          presentationStyle="overFullScreen"
          onRequestClose={close}>
          <TouchableOpacity
            activeOpacity={1}
            onPress={close}
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              zIndex: 99999,
              elevation: 99999,
              backgroundColor: 'rgba(0,0,0,0.4)',
              justifyContent: 'flex-end',
            }}>
            <TouchableOpacity
              activeOpacity={1}
              className="rounded-t-2xl bg-white p-4"
              style={{ zIndex: 100000 }}>
              {alert?.title ? (
                <Text className="text-base font-semibold text-slate-900">{alert.title}</Text>
              ) : null}
              {alert?.message ? (
                <Text className="mt-1 text-sm text-slate-600">{alert.message}</Text>
              ) : null}

              <View className="mt-2">
                {alert?.buttons.map((btn, i) => (
                  <TouchableOpacity
                    key={`${btn.text ?? 'btn'}-${i}`}
                    className="py-3"
                    onPress={() => {
                      close();
                      btn.onPress?.();
                    }}>
                    <Text
                      className={`text-base ${
                        btn.style === 'destructive'
                          ? 'text-red-600'
                          : btn.style === 'cancel'
                            ? 'text-slate-500'
                            : 'text-slate-800'
                      }`}>
                      {btn.text ?? 'OK'}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </WebAlertContext.Provider>
  );
};
