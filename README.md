# PlanificadorLayher

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 9.1.0.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

- Instalar Devextreme
  · Un solo comando:
    npx -p devextreme-cli devextreme add devextreme-angular
  · Una version en concreto:
    1 --> npm install devextreme@20.1.4 devextreme-angular@20.1.4 --save --save-exact
    2 --> En "angular.json", en el apartado de "styles" añadir las siguientes líneas:
          "styles": [
            "node_modules/devextreme/dist/css/dx.common.css",
            "node_modules/devextreme/dist/css/dx.light.css",
            ... ,
            "src/styles.css"
          ],
  https://js.devexpress.com/Documentation/Guide/Angular_Components/Getting_Started/Add_DevExtreme_to_an_Angular_CLI_Application/

- Instalar Bootstrap
  · En index.html añadir <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6" crossorigin="anonymous">
  · $ npm install bootstrap
  · Añadir en angular.json en styles "node_modules/bootstrap/dist/css/bootstrap.css",
  https://aspnetcoremaster.com/angular/instalar-bootstrap-5-en-angular.html
  https://getbootstrap.com/

- Instalar Angular Material
  $ ng add @angular/material
  https://material.angular.io/guide/getting-started

- Crear modulos con las importaciones de componentes segun la libreria
  - $ ng g m %nombreModulo%
  - Dentro del modulo creado se importan los componentes que queremos utilizar
  - Los añadimos en imports y en exports
  - En app.module.ts importamos la llamada a este modulo que hemos creado para poder acceder a los componentes importados y se añade en imports

- Instalar fs-web:
  $ npm install fs-web --save
  - import * as fs from 'fs-web';
  - fs.writeFile(fileName, data)
  - fs.readString(fileName)
  https://github.com/matthewp/fs

INSTRUCCIONES PARA COLABORAR

->Cuenta principal del proyecto

- Crear cuenta en Github
- En VSC agregar comando con correo registrado en Github
			git config --global user.email SU-CORREO-ELECTRONICO
- Click en el icono de la nube para subir el proyecto por primera vez
- Ir a repositorio en GitHub -> Settings -> Manage access -> Invite a collaborator - > añadir correo


-> Cuenta colaboradora
- Ver el correo y aceptar la invitacion
- Hacer "Fork" del repositorio, para que se copie el repositorio en tu propia cuenta
- En VSC agregar comando con correo registrado en Github

	$ git config --global user.email SU-CORREO-ELECTRONICO

- Abir VSC y clonar el proyecto desde terminal 
- o desde el propio VSC -> GIT -> CLONAR REPOSITORIO -> "https://github.com/User/NombreRepo.git"
	
	$ git clone https://github.com/User/NombreRepo.git

- Agregar la ruta donde se va a guardar el proyecto en local	

- Dentro de la carpeta que genera, comprobar la URL del repositorio:
	
	$ git remote -v

- Antes de realizar modificaciones agregar la URL del repositorio original del proyecto:
	
	$ git remote add upstream https://github.com/User/RepoOriginal(Forkeado)

- Comprobar
	
	$ git remote -v			 

- Antes de empezar a trabajar, obtener los últimos cambios del Repo Original (o icono de la nube)
	
	$ git pull -r upstream master

- Editar los ficheros que se desea y hacer un commit
- Sincronizar con el icono de la nube para que se suban a tu repositorio
- Para subir los cambios al proyecto final, desde Github ir al repositorio, pull request, comparar archivos, y si hay algun conflicto solucionarlo
- Confirmar con "Create Pull Request", comentar lo que se ha cambiado
- "Merge Pull Request" para confirmar los cambios y pasarlo a la principal, "Confirm Merge"

INTRUCCIONES PARA ELIMINAR EL REPOSITORIO AL QUE APUNTA Y CAMBIARLO POR OTRO

- git remote set-url [--push] <name> <newurl> [<oldurl>]
- git remote set-url --add <name> <newurl>
- git remote set-url --delete <name> <url>

- Cambiar el origin
  $ git remote set-url origin https://github.com/Alejandro-Rubio/TerminalAngular.git

- Eliminar repositorio que no se va a usar
  $ git remote set-url --delete upstream https://github.com/jhontivan/TerminalAngular.git

- Añadir repositorio al que se va a apuntar

  $ git remote set-url --add upstream https://github.com/Vstock-Desarrollo-00/TerminalAngular.git 


INSTRUCCIONES PARA EL USO DE RAMAS
- Ver las ramas que tenemos y en cual estamos posicionados:
  $ git branch

- Ver las ramas con más detalle:
  $ git show-branch

- Crear una rama nueva:
  $ git branch nombre_rama

- Movernos a una rama para posicionarnos sobre ella:
  $ git checkout nombre_rama

- Crear una rama y movernos sobre ella directamente:
  $ git checkout -b otraRama

- Si nos situamos sobre la rama "master" y lanzamos el siguiente comando, fusionaremos la rama que pongamos ("nombre_rama") sobre la master:
  $ git merge nombre_rama

- Lo mismo que lo anterior pero enviando un mensaje:
  $ git merge nombre_rama -m 'Esto es un merge con mensaje'

- Si por ejemplo estamos trabajando en la rama "nombre_rama" y queremos traernos los cambios de la rama "master", nos situamos sobre "nombre_rama" y lanzamos el siguiente comando incluyendo un mensaje:
  $ git checkout nombre_rama
  $ git merge master -m 'Confirmación (Una sola palabra)'

- Subir una rama a tu repositorio GitHub:
  $ git push -u origin nombre_rama

- Incorporar ramas de upstream
  $ git fetch upstream

- Borrar una rama:
  $ git branch -d nombre_rama

- Borrar una rama de manera forzada ya que si hemos hecho cambios en esta y no se han subido puede que no nos deje borrarla con el comando anterior:
  $ git branch -D nombre_rama

- Borrar una rama que se encuentra en el repositorio remoto:
  $ git push origin --delete nombre_rama

----- TRADUCCION EXPLICACION ----
- Instalar los siguientes paquetes (2)

  $ npm install @ngx-translate/core@13.0.0 --save

  $ npm install @ngx-translate/http-loader@6.0.0 --save

- Agregar a app.module.ts (principio)

  import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
  import { TranslateHttpLoader } from '@ngx-translate/http-loader';
  import { HttpClient, HttpClientModule } from '@angular/common/http';

  export function HttpLoaderFactory(httpClient: HttpClient) {
    return new TranslateHttpLoader(
      httpClient,
      'http://localhost:49220/api/login/getLenguaje', ''
    );
  }

- Agregar en app.module.ts (en imports)

  imports:[
  HttpClientModule,
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
        }
      })
  ]

- Agregar en esto a cualquier evento donde se quiera llamar a los lenguajes

  constructor(translate: TranslateService) {
    translate.addLangs(['en', 'da']);
    translate.setDefaultLang('en');

    const browserLang = translate.getBrowserLang();
    translate.use('en');
  }

- Se traduce en el HTML ej:

    <span>{{'app-title' | translate }}</span>


- Instalar paquetes de iconos:
  · Como agregar fontawesome:
    -- npm install @fortawesome/fontawesome-free
    -- En angular.json, en styles: "node_modules/@fortawesome/fontawesome-free/css/all.min.css",

  · Como agregar iconos de bootstrap:
    -- npm i bootstrap-icons --save
    -- En styles.css: @import "~bootstrap-icons/font/bootstrap-icons.css";


- Compilar WEB:
	1 - Elegir dependiendo de la empresa:
		node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --prod --base-href="./"   --> VILETEL
		node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=alfran --base-href="./"
    node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=harinalia --base-href="./"
    node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=fersa --base-href="./"
    node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=escuderoFijo --base-href="./"
    node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=frigorificosSoly --base-href="./"
    node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=frLogistics --base-href="./"
    node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=I3E --base-href="./"
    node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=general --base-href="./"
      - La general está apuntando a un environment sin IP ni Puerto para que se pueda cambiar manualmente en los ficheros "main..."
	2 - Se guarda la carpeta "www" generada y se actualiza

- Compilar (actualizar) APK:
	1 - ng build --configuration=apk
      	- Para aumentar la memoria: 
      		node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=apk
  2 - npx cap sync
  3 - npx cap open android  --> Abrirá Android Studio
  4 - En Android Studio -> Build -> Generate Signed Bundle or APK -> Se selecciona la opción de APK -> Se eligen las claves de donde estén ubicadas y se introducen las contraseñas -> En la selección de "debug" o "release" se selecciona "release" -> Finish


- Compilar APK desde 0 instalando librerías:
	1 - npm install -- save @capacitor/core @capacitor/cli
  2 - Abrir el fichero "angular.json" y cambiar "outputPath" : "dist/bootstrap" por "outputPath" : "www"
  3 - ng build --prod  //  ng build --configuration=apk
    - Para aumentar la memoria: 
        node --max_old_space_size=6144 ./node_modules/@angular/cli/bin/ng build --configuration=apk
  4 - npx cap init
  5 - npm i @capacitor/android
  6 - En el fichero "capacitor.config.json" que se ha creado, cambiar "webDir": "dist" por "webDir": "www"
  7 - npx cap add android
  8 - npx cap copy android
  9 - npx cap open android
  10 - En Android Studio -> Build -> Generate Signed Bundle or APK -> Se selecciona la opción de APK -> Se eligen las claves de donde estén ubicadas y se introducen las contraseñas -> En la selección de "debug" o "release" se selecciona "release" -> Finish
  # Para que funcionen las peticiones entre el terminal y el webapi hace falta un fichero de configuración de conexión que se llamará "network_security_config.xml" y estará alojado en "...\android\app\src\main\res\xml"
    <?xml version ="1.0" encoding ="utf-8"?><!--  Learn More about how to use App Actions: https://developer.android.com/guide/actions/index.html -->
    <network-security-config xmlns:tools="http://schemas.android.com/tools">
      <base-config cleartextTrafficPermitted="true">
        <trust-anchors>
          <certificates src="system" />
          <certificates src="user" />
        </trust-anchors>
      </base-config>
    </network-security-config>

  

- Para instalar aplicaciones diferentes, en AndroidStudio, en el fichero "build: gradle (Module: android.app)" en "applicationId" darle el nombre de la app ("com.VstockMobile.app")


- Como crear ambientes (environments):
  · En src/environments, crear el ambiente que queramos siguiendo esta estructura: environment."nombre_ambiente.ts" 

  · En este añadir :
    export const environment = {
      production: true,
      /* 
       * y las propiedades que queramos que tenga
       */
    }

  · Después ir a angular.json y en architect/build/configurations, después de la llave de "production" añadir:
    "nombre_ambiente": {
      "fileReplacements": [{
          "replace": "src/environments/environment.ts",
          "with": "src/environments/environment.nombre_ambiente.ts"
      }]
    }

  · Luego en architect/serve/configurations:
    "nombre_ambiente": {
      "browserTarget": "bootstrap:build:nombre_ambiente"
    }

  · Y ya podemos acceder a él desde cualquier lado apuntando a este, pero para ello tendremos que compilar la app con "ng serve --configuration=nombre_ambiente"

- ====== PONER VARIOS GRID EN UNA MISMA PANTALLA ======
  -- 1 -> iniciar grids con tamaño = 0
  -- 2 -> en el btnFooter poner al final true, true, [el segundo true es para poner los botones pequeños en pantallas pequeñas]
  -- 3 -> en actualizarAltura, pasarle el parametro de numero de grids en la pantalla [por defecto es 1]
  -- 4 -> para que no haya problema de resize, se ponen todos los grids tamaño = 0 y se da un setTimeout, ajustando btnFooter, ActualizarAlturas

- Ejecutar web desde carpeta (sin IIS): 
  - Normal: http-server -o
  - Con un puerto que queramos: http-server --port=8091

- Problema cuando no se pueda instalar alguna libreria, el fichero no se corresponde con las librerias
  - //Borrar el fichero
  - rm package-lock.json
  - // Volver a generar el fichero internamente
  - npm install --package-lock

- Plugins instalados de capacitor (cada uno de ellos hay que indicarlos en el MainActivity del proyecto de Android Studio)
  Se ha actualizado @capacitor/core para poder instalar los siguientes plugins
  - App: 
    · Instalación: npm install @capacitor/app  
    · Documentación: https://capacitorjs.com/docs/apis/app
    · Línea que añadir en el main del proyecto de Android dentro del onCreate: 
      registerPlugin(com.capacitorjs.plugins.app.AppPlugin.class);
  - Filesystem: 
    · Instalación: npm install @capacitor/filesystem
    · Documentación: https://capacitorjs.com/docs/apis/filesystem
    · Línea que añadir en el main del proyecto de Android dentro del onCreate: 
      registerPlugin(com.capacitorjs.plugins.filesystem.FilesystemPlugin.class);
  - Text-to-speech: 
    · Instalación: npm install @capacitor-community/text-to-speech
    · Documentación: https://github.com/capacitor-community/text-to-speech
    · Línea que añadir en el main del proyecto de Android dentro del onCreate: 
      registerPlugin(com.getcapacitor.community.tts.TextToSpeechPlugin.class);
  - Speech-recognition: 
    · Instalación: npm install @capacitor-community/speech-recognition  
    · Documentación: https://github.com/capacitor-community/speech-recognition
    · Línea que añadir en el main del proyecto de Android dentro del onCreate: 
      registerPlugin(com.getcapacitor.community.speechrecognition.SpeechRecognition.class);

- PRUEBAS DE FILEOPENER (para saber que probamos):
  - npm install cordova-plugin-file-opener2 -> desinstalado - no funciona
  - npm install @awesome-cordova-plugins/file-opener -> desinstalado - no funciona

  - npm install cordova-plugin-file -> desinstalado - no funciona
  - npm install @ionic-native/file -> desinstalado - no funciona

  - npm install -g @ionic/cli -> desinstalado - no funciona

  - npm install -g cordova -> desinstalado - no funciona

  - npm install @ionic-native/core -> desinstalado - no funciona

  - npm i @ionic-native/file-opener -> desinstalado - no funciona

  - cordova-plugin-androidx -> desinstalado - no funciona
  - cordova-plugin-androidx-adapter -> desinstalado - no funciona

- Configuración de ambientes:
  - General:
    · titulo: "XXXXXXXXXXXX"
    · dominio: "http://999.999.999.999"
    · puerto: "99999"
  - Alfran:
    · titulo: "Alfran"
    · dominio: "http://192.168.1.5"
    · puerto: "9200"
  - Escudero Fijo:
    · titulo: "Escudero Fijo"
    · dominio: "http://192.168.1.233"
    · puerto: "9200"
  - Fersa Iberica:
    · titulo: "Fersa Iberica"
    · dominio: "http://192.168.50.86"
    · puerto: "9200"
  - Harinalia:
    · titulo: "Harinalia"
    · dominio: "http://192.168.1.21"
    · puerto: "9200"
  - Frigoríficos Soly
    · titulo: "Frigoríficos Soly"
    · dominio: "http://172.16.70.71"
    · puerto: "9200"
