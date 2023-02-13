package com.aoreo.fooddeliveryapp;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.skt.Tmap.TMapTapi;
import java.util.HashMap;

public class TMapModule extends ReactContextBaseJavaModule {
    TMapModule(ReactApplicationContext context) {
        super(context);
        // 모듈 로딩 시 실행되는 부분
        TMapTapi tMapTapi = new TMapTapi(context);
        tMapTapi.setSKTMapAuthentication("7yod3BNAYGa28IlV2E5vs31ZVtpzQZ1ZaTyTCW8Y"); // 여기에 여러분의 키 넣을 것
    }

    @Override
    public String getName() {
        return "TMap";
    }

    @ReactMethod
    public void openNavi(String name, String longitude, String latitude, String vehicle, Promise promise) {
        TMapTapi tMapTapi = new TMapTapi(getReactApplicationContext());
        boolean isTMapApp = tMapTapi.isTmapApplicationInstalled();
        if (isTMapApp) {
            HashMap pathInfo = new HashMap();
            pathInfo.put("rGoName", name);
            pathInfo.put("rGoX", longitude);
            pathInfo.put("rGoY", latitude);
            pathInfo.put("rSOpt", vehicle.equals("MOTORCYCLE") ? "6" : "0");
            boolean result = tMapTapi.invokeRoute(pathInfo); //invokeRoute 네비게이션 켜는 method
            if (result) {
                promise.resolve(true);
            } else {
                promise.resolve(true);
            }
        } else {
            promise.resolve(false);
        }
    }
}