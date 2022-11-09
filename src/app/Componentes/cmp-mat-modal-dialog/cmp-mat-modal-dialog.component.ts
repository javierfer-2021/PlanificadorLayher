import { Component, OnInit, AfterViewInit, Inject, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-cmp-mat-modal-dialog',
  templateUrl: './cmp-mat-modal-dialog.component.html',
  styleUrls: ['./cmp-mat-modal-dialog.component.css']
})
export class CmpMatModalDialogComponent implements OnInit, AfterViewInit {

  tipoModal : TipoDialogo;

  constructor( 
    private dialogo: MatDialogRef<CmpMatModalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData)
  {} 

  ngOnInit() {
  }

  ngAfterViewInit(): void {
    this.tipoModal = this.data.tipo;
  }

  cerrarDialog_NO(): void {
    this.dialogo.close(false);
  }

  cerrarDialog_YES(): void {
    this.dialogo.close(true);
  }

  public close(value) {
    this.dialogo.close(value);
  }

  @HostListener("keydown.esc") 
  public onEsc() {
    this.close(false);
  }

}


//#region -- COMPONENTE Y FUNCIONES PARA MOSTRAR MODAL

/*
export class matModalDialog {

  constructor(public dialog: MatDialog,
              public translate: TranslateService) { }


  traducir(key: string, def: string): string {
    let traduccion: string = this.translate.instant(key);
    if (traduccion !== key) {
      return traduccion;
    } else {
      return def;
    }
  }

  traducirBoton(tipo:TipoBotonesDialogo):string {
    switch (tipo) {
      case TipoBotonesDialogo.Yes :
        return this.traducir('DialogService.TipoBotonesDialogoYes', 'Si');
      case TipoBotonesDialogo.No :
        return this.traducir('DialogService.TipoBotonesDialogoNo', 'No');
      case TipoBotonesDialogo.Ok :
        return this.traducir('DialogService.TipoBotonesDialogoOk', 'OK');
      case TipoBotonesDialogo.Cancel :
        return this.traducir('DialogService.TipoBotonesDialogoCancel', 'Cancelar');
      case TipoBotonesDialogo.Confirm :
      return this.traducir('DialogService.TipoBotonesDialogoConfirm', 'Confirmar');
      default:
        return this.traducir('DialogService.TipoBotonesDialogoIndefinido', '');
    }
  }


  traducirTipoDialogo(tipo:TipoDialogo):string {
    switch (tipo) {
      case TipoDialogo.aviso :
        return this.traducir('DialogService.TipoDialogoAviso', 'Aviso');
      case TipoDialogo.confirmacion :
        return this.traducir('DialogService.TipoDialogoConfirmacion', 'Confirmar');
      case TipoDialogo.error :
        return this.traducir('DialogService.TipoDialogoError', 'Error');
      case TipoDialogo.indefinido :
      default:
        return this.traducir('DialogService.TipoDialogoAviso', '');
    }
  }
            

  public abrirDialogo() {
    
    let data:DialogData ;
    data.mensaje =  'Mensaje modal'
    this.dialog
    .open(CmpMatModalDialogComponent, {data})
    .afterClosed()
    .subscribe((confirmado: Boolean) => {
      if (confirmado) {
        alert("¡A mí también!");
      } else {
        alert("Deberías probarlo, a mí me gusta :)");
      }
    });
    
  }

  show_ConfirmDialog(mensaje:string): Observable<boolean> { 
    let data:DialogData;
    data.titulo=this.traducirTipoDialogo(TipoDialogo.confirmacion);
    data.mensaje=mensaje;
    data.confirmarText=this.traducirBoton(TipoBotonesDialogo.Confirm);
    data.cancelarText=this.traducirBoton(TipoBotonesDialogo.Cancel)
    return this.dialog.open(CmpMatModalDialogComponent, {
        data,
        disableClose: true,
      })
      .afterClosed();
  }


  
  show_WarningmDialog(data: DialogData): Observable<boolean> {
    data.titulo= this.traducirTipoDialogo(TipoDialogo.aviso);
    data.mensaje='Este es el mensaje que se pasa como parametro';
    return this.dialog
      .open(CmpMatModalDialogComponent, {
        data,
        disableClose: true,
      })
      .afterClosed();
  }
  
}
*/
//#endregion -- COMPONENTE Y FUNCIONES PARA MOSTRAR MODAL



//#region -- CLASES Y TIPOS
export class DialogData {
  tipo : TipoDialogo;
  titulo: string;
  mensaje: string;
  confirmarText: string;
  cancelarText: string;
}


export  enum TipoDialogo {
  confirmacion = 1,
  error = 2,
  aviso = 3,
  indefinido = 4
}


export enum TipoBotonesDialogo {
  Yes = 1,
  No = 2,
  Ok = 3,
  Cancel = 4,
  Confirm = 5,
  YesNo = 10,
  OkCancel = 11,
  ConfirmCancel = 12
}

//#endregion -- CLASES Y TIPOS
