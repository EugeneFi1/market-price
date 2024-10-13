import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-empty-content',
  templateUrl: './empty-content.component.html',
  styleUrl: './empty-content.component.less',
  standalone: true,
})
export class EmptyContentComponent {
  @Input() public text: string = 'No data to display';
}
