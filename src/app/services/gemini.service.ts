import { Injectable } from '@angular/core';
import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from '@google/generative-ai';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';

export type RelationshipType = 'partner' | 'crush' | 'spouse';
export type ToneType = 'romantic' | 'playful' | 'poetic';

export interface LoveLetterRequest {
  recipient: string;
  relationship: RelationshipType;
  tone: ToneType;
  details?: string;
}

export interface LoveLetterResponse {
  letter: string;
}



@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  genAI = new GoogleGenerativeAI(environment.GOOGLE_GEMINI_API_KEY);
  private safetyPrompt : string = `You are a respectful love letter writer. Keep the content tasteful and appropriate. 
  Do not include any explicit or inappropriate content. Focus on expressing genuine emotions and feelings.
  Never include contact information, addresses, or specific locations.
  Avoid any harmful, offensive, or discriminatory content.`;
  
  generateLoveLetter(data: LoveLetterRequest): Observable<LoveLetterResponse> {
    // Basic validation
    if (!data.recipient || data.recipient.length > 50) {
      return throwError(() => new Error('Recipient name is required and must be less than 50 characters'));
    }

    // Build the prompt
    const userPrompt : string = `Write a ${data.tone} love letter to my ${data.relationship} named ${data.recipient}. ${
      data.details ? `Include these details: ${data.details}` : ''
    }`;
    
    const fullPrompt = `${this.safetyPrompt}\n\n${userPrompt}`;
    
    return this.generateWithGemini(fullPrompt);
  }

  private generateWithGemini(prompt: string): Observable<LoveLetterResponse> {
    return new Observable<LoveLetterResponse>(observer => {
      // Get the generative model
      const model = this.genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
          },
        ],
      });

      // Generate content
      model.generateContent(prompt)
        .then(result => {
          const text = result.response.text();
          observer.next({ letter: text });
          observer.complete();
        })
        .catch(error => {
          observer.error('Failed to generate love letter: ' + error.message);
        });
    });
  }
}
