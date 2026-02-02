import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, Text, TouchableOpacity, View } from 'react-native';
import { createPortal } from 'react-dom';

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

export const WebAlertProvider = ({ children }: { children: React.ReactNode }) => {
  const [alert, setAlert] = useState<AlertState>(null);
  const originalRef = useRef(Alert.alert);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  const show = useCallback((title?: string, message?: string, buttons?: AlertButton[]) => {
    const list = buttons?.length ? buttons : [{ text: 'OK' }];
    setAlert({ title, message, buttons: list });
  }, []);

  const close = useCallback(() => setAlert(null), []);

  useEffect(() => {
    (Alert as any).alert = (title?: string, message?: string, buttons?: AlertButton[]) =>
      show(title, message, buttons);
    return () => {
      (Alert as any).alert = originalRef.current;
    };
  }, [show]);

  useEffect(() => {
    if (!alert) return;
    const el = document.createElement('div');
    el.style.position = 'fixed';
    el.style.inset = '0';
    el.style.zIndex = '999999';
    document.body.appendChild(el);
    setPortalEl(el);
    return () => {
      document.body.removeChild(el);
      setPortalEl(null);
    };
  }, [alert]);

  return (
    <>
      {children}
      {alert && portalEl
        ? createPortal(
            <View className="fixed inset-0 h-screen w-screen items-center justify-center bg-black/40 p-4">
              <TouchableOpacity
                activeOpacity={1}
                onPress={close}
                style={{ position: 'absolute', inset: 0 }}
              />
              <View
                style={{
                  width: '100%',
                  maxWidth: 360,
                  backgroundColor: '#fff',
                  borderRadius: 16,
                  overflow: 'hidden',
                  shadowColor: '#000',
                  shadowOpacity: 0.2,
                  shadowRadius: 12,
                  shadowOffset: { width: 0, height: 6 },
                }}>
                {alert.title ? (
                  <Text style={{ fontSize: 16, fontWeight: '600', color: '#0f172a', padding: 16 }}>
                    {alert.title}
                  </Text>
                ) : null}

                {alert.message ? (
                  <Text
                    style={{
                      fontSize: 13,
                      color: '#475569',
                      paddingHorizontal: 16,
                      paddingBottom: 12,
                    }}>
                    {alert.message}
                  </Text>
                ) : null}

                <View style={{ borderTopWidth: 1, borderTopColor: '#e2e8f0' }}>
                  {alert.buttons.map((btn, i) => (
                    <TouchableOpacity
                      key={`${btn.text ?? 'btn'}-${i}`}
                      style={{
                        paddingVertical: 14,
                        alignItems: 'center',
                        backgroundColor: '#f8fafc',
                        borderTopWidth: i === 0 ? 0 : 1,
                        borderTopColor: '#e2e8f0',
                      }}
                      onPress={() => {
                        close();
                        btn.onPress?.();
                      }}>
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '600',
                          color:
                            btn.style === 'destructive'
                              ? '#dc2626'
                              : btn.style === 'cancel'
                                ? '#64748b'
                                : '#1e293b',
                        }}>
                        {btn.text ?? 'OK'}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>,
            portalEl
          )
        : null}
    </>
  );
};
