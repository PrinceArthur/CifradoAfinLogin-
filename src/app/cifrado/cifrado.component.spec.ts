import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CifradoComponent } from './cifrado.component';

describe('CifradoComponent', () => {
  let component: CifradoComponent;
  let fixture: ComponentFixture<CifradoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CifradoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CifradoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
