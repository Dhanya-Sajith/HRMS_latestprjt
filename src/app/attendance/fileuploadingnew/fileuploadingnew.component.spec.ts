import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileuploadingnewComponent } from './fileuploadingnew.component';

describe('FileuploadingnewComponent', () => {
  let component: FileuploadingnewComponent;
  let fixture: ComponentFixture<FileuploadingnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FileuploadingnewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileuploadingnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
