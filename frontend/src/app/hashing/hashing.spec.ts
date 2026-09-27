import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Hashing } from './hashing';
import { provideRouter } from '@angular/router';
import { render, screen } from '@testing-library/angular';

describe('Hashing', () => {
  let component: Hashing;
  let fixture: ComponentFixture<Hashing>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Hashing],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Hashing);
    component = fixture.componentInstance;
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have a loadHash method', () => {
    expect(component.loadHash).toBeDefined();
  });
  it('should have a loadHash method that is a function', () => {
    expect(typeof component.loadHash).toBe('function');
  });
  it('should have the sha512 text in the template', async () => {
    expect(fixture.nativeElement.querySelector('option[value="sha512"]')?.textContent.trim()).toBe(
      'SHA-512',
    );
  });
  it('should have the md5 text in the template', async () => {
    expect(fixture.nativeElement.querySelector('option[value="md5"]')?.textContent.trim()).toBe(
      'MD5',
    );
  });
  it('should have the Hashing text in the template', async () => {
    expect(fixture.nativeElement.textContent).toContain('Hashing');
  });
  it('should have the Convertieren text in the template', async () => {
    expect(fixture.nativeElement.textContent).toContain('Convertieren');
  });
  it('should render the input label text in the template', async () => {
    expect(
      fixture.nativeElement.textContent,
    ).toMatch(/Bitte gib mir den Text an, den ich convertieren soll\.:/i);
  });
});
