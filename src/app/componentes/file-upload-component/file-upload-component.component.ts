// file-upload-component.component.ts
import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload-component.component.html',
  styleUrls: ['./file-upload-component.component.scss']
})
export class FileUploadComponentComponent {
  @Output() fileSelected = new EventEmitter<File>();

  onFileSelected(event: any): void {
    const inputElement: HTMLInputElement = event.target;
    
    if (inputElement.files && inputElement.files.length > 0) {
      const file: File = inputElement.files[0];
      this.fileSelected.emit(file);
    }
  }
}
