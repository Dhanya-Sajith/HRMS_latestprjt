import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadingComponent } from './fileuploading.component';

describe('FileuploadingComponent', () => {
  let component: FileuploadingComponent;
  let fixture: ComponentFixture<FileuploadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileuploadingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileuploadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
