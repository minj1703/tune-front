// 이 파일은 대부분의 구성을 프로그래밍적으로 처리합니다.
export default ({ config = {} }) => {
  return {
    ...config, 
    name: "Tunemaker",
    slug: "tunemaker",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    splash: {
      image: "./assets/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff"
    },
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true
    },
    android: {
      package: "com.Tunmaker.tunemaker",  
      adaptiveIcon: {
        foregroundImage: "./assets/icon.png",
        backgroundColor: "#FFFFFF"
      }
    },
    web: {
      favicon: "./assets/favicon.png"
    },
    extra: {
      Keyis: process.env.KEYIS,
      Secret_key: process.env.SECRET_KEY,
       eas: {
         projectId: "813bf17d-7f86-4736-a041-c7d5bb1908a8"
       }
    }
  };
};
