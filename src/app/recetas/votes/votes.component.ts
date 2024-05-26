import { ChangeDetectionStrategy, Component, EventEmitter, Injectable, Input, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VotesComponent {
  rating = 0;
  stars = Array(5).fill(0);
  voteForm: FormGroup;

  @Output() vote = new EventEmitter<{rating: number, comment: string}>();


  constructor(private fb: FormBuilder) {
    this.voteForm = this.fb.group({
      comment: ['']
    });
  }

  selectStar(index: number) {
    this.rating = index + 1;
  }

  submitVote() {
    const comment = this.voteForm.value.comment;
    this.vote.emit({rating: this.rating, comment: comment});  }

}
