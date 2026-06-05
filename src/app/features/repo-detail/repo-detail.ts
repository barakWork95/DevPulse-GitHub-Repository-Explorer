import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Repository } from '../../models/github.models';
import { FormatNumberPipe } from '../../shared/pipes/format-number-pipe';
import { GithubService } from '../../core/services/github';
import { marked } from 'marked';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-repo-detail',
  standalone: true,
  imports: [FormatNumberPipe, RouterLink],
  templateUrl: './repo-detail.html',
  styleUrl: './repo-detail.scss',
})
export class RepoDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly githubService = inject(GithubService);
  private readonly sanitizer = inject(DomSanitizer);

  repo!: Repository;
  readme = signal<SafeHtml | null>(null);
  readmeLoading = signal(true);

  ngOnInit(): void {
    this.repo = this.route.snapshot.data['repo'];

    this.githubService
      .getReadme(this.repo.owner.login, this.repo.name)
      .subscribe(async (markdown) => {
        const html = await marked(markdown);
        this.readme.set(this.sanitizer.bypassSecurityTrustHtml(html));
        this.readmeLoading.set(false);
      });
  }
}
