/* eslint-disable @typescript-eslint/indent */
import { Component, Input } from '@angular/core';
import { GeneratorProps } from '../dg-type-descriptions';
import { Clipboard } from '@angular/cdk/clipboard';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'data-generator-content',
  templateUrl: './data-generator-content.component.html',
  styleUrl: './data-generator-content.component.scss'
})
export class DataGeneratorContentComponent {
  @Input() selectedNode: GeneratorProps | undefined;
  public paramsExplainerColumns: string[] = ['name', 'description'];
  public displayedColumns: string[] = [...this.paramsExplainerColumns, 'required', 'default'];

  constructor(private readonly clipboard: Clipboard, private readonly translate: TranslateService) { }

  public copyKey(text: string): void {
    this.clipboard.copy(text);
  }
}
