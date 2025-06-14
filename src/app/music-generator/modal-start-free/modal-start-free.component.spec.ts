import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalStartFreeComponent } from './modal-start-free.component';

describe('ModalStartFreeComponent', () => {
  let component: ModalStartFreeComponent;
  let fixture: ComponentFixture<ModalStartFreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalStartFreeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalStartFreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
