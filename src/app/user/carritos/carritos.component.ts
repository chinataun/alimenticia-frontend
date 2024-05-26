import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { UserService } from '../user.service';
import * as jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { ConfirmDialogComponent } from 'src/app/componenets/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-carritos',
  templateUrl: './carritos.component.html',
  styleUrl: './carritos.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CarritosComponent {
  carritos$ = this.userService.carritos$;
  carritosVacio!: boolean;
  constructor(
    private userService: UserService,
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.userService.getCarritos().subscribe(
      (carritos) => {
        console.log(carritos);
        this.carritosVacio = carritos.length === 0;
      }
    );
    this.cd.detectChanges();
  }

  eliminarCarrito(id: Number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: '¿Estás seguro de que quieres eliminar el carrito?',
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.userService.eliminarCarrito(String(id)).subscribe(() => {
          this.userService.getCarritos().subscribe(
            (carritos) => {
              console.log(carritos);
            }
          );
        });
      }
    });
    
  }

  downloadPDF(elementId: string) {
    const elementToPrint = document.getElementById(elementId);

    if (elementToPrint) { // Comprobación de nulabilidad
      html2canvas(elementToPrint).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jspdf.jsPDF({
          orientation: 'portrait',
          unit: 'in', // Unidades en pulgadas. Puedes usar 'pt' para puntos
          format: [4, 6] // Tamaño de la página en pulgadas. [ancho, alto]
        });
  
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight(); // Cambio aquí
  
        // Calcular la relación de aspecto de la imagen
        const aspectRatio = imgProps.width / imgProps.height;
  
          // Calcular el nuevo ancho y alto de la imagen basado en la relación de aspecto
          let scaledWidth = pdfWidth;
          let scaledHeight = pdfWidth / aspectRatio;

          // Si la altura escalada es mayor que la altura del PDF, ajustar la altura y la anchura
          if (scaledHeight > pdfHeight) {
            scaledHeight = pdfHeight;
            scaledWidth = pdfHeight * aspectRatio;
          }

   pdf.addImage(imgData, 'PNG', 0, 0, scaledWidth, scaledHeight);
        pdf.save('carritos.pdf');
      });
    } else {
      console.error('Elemento no encontrado');
    }
  }
}
