import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUploadComponentComponent } from './file-upload-component.component';

describe('FileUploadComponentComponent', () => {
  let component: FileUploadComponentComponent;
  let fixture: ComponentFixture<FileUploadComponentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FileUploadComponentComponent]
    });
    fixture = TestBed.createComponent(FileUploadComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
