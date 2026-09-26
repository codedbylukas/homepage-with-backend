import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Encoding } from './encoding';
import { provideRouter } from '@angular/router';

describe('Encoding', () => {
  let component: Encoding;
  let fixture: ComponentFixture<Encoding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Encoding],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Encoding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
    it('defined function loadEncoding', async () => {
    expect(component.loadEncoding).toBeDefined();
  });
});
