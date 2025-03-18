import { Component, inject, signal } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Clipboard } from '@angular/cdk/clipboard';
import {
  GeminiService,
  RelationshipType,
  ToneType,
} from '../../services/gemini.service';

@Component({
  selector: 'app-generate',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './generate.component.html',
  styles: ``,
})
export class GenerateComponent {
  geminiService: GeminiService = inject(GeminiService);
  formBuilder: FormBuilder = inject(FormBuilder);
  private clipboard: Clipboard = inject(Clipboard);
  letterForm: FormGroup = this.formBuilder.group({
    sender: ['', [Validators.required, Validators.maxLength(50)]],
    recipient: ['', [Validators.required, Validators.maxLength(50)]],
    relationship: ['partner', Validators.required],
    tone: ['romantic', Validators.required],
    details: ['', Validators.maxLength(500)],
  });
  generatedLetter = signal<string>('');
  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');

  relationshipOptions: { value: RelationshipType; label: string }[] = [
    { value: 'partner', label: 'Partner' },
    { value: 'crush', label: 'Crush' },
    { value: 'spouse', label: 'Spouse' },
  ];

  toneOptions: { value: ToneType; label: string }[] = [
    { value: 'romantic', label: 'Romantic' },
    { value: 'playful', label: 'Playful' },
    { value: 'poetic', label: 'Poetic' },
  ];

  toast = signal<{
    message: string;
    status: 'success' | 'error' | 'warning' | 'info';
    title?: string;
  } | null>(null);
  onSubmit(): void {
    if (this.letterForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.generatedLetter.set('');
    const { sender, recipient, relationship, tone, details } =
      this.letterForm.value;
    // Add sender name to details if provided
    const enhancedDetails = sender
      ? `${details ? details + '. ' : ''}This letter is from ${sender}.`
      : details;

    this.geminiService
      .generateLoveLetter({
        recipient,
        relationship: relationship as RelationshipType,
        tone: tone as ToneType,
        details: enhancedDetails,
      })
      .subscribe({
        next: (response) => {
          this.generatedLetter.set(response.letter);
          this.isLoading.set(false);
        },
        error: (error) => {
          this.errorMessage =
            error.message ||
            'An error occurred while generating your love letter';
          this.isLoading.set(false);
        },
      });
  }
  dismissToast(): void {
    this.toast.set(null);
  }
  copyToClipboard(): void {
    if (this.generatedLetter()) {
      this.clipboard.copy(this.generatedLetter());
      this.toast.set({
        status: 'success',
        message: 'Copied to clipboard!',
        title: 'Success!',
      });
      // Create temporary success message
      // const originalError = this.errorMessage();
      // this.errorMessage.set('Copied to clipboard!');
      // setTimeout(() => {
      //   this.errorMessage.set(originalError);
      // }, 2000);
      setTimeout(() => this.toast.set(null), 3000);
    }
  }

  get senderControl() {
    return this.letterForm.get('sender');
  }

  get recipientControl() {
    return this.letterForm.get('recipient');
  }
  get detailsControl() {
    return this.letterForm.get('details');
  }
}
