You are an expert senior full-stack engineer, React developer, UI/UX designer, product designer, database architect, and QA engineer.

Build a production-quality, responsive habit tracking web application inspired by the two reference screenshots I provided.

IMPORTANT:
The screenshots are visual references only.
Do NOT simply recreate the spreadsheet.
Transform the concept into a modern, polished, responsive web application with excellent UX.

The application should feel like a premium habit-tracking SaaS product.

Use React for the frontend.

The application must work beautifully on:
- Desktop
- Laptop
- Tablet
- Mobile
- Small Android phones
- Large phones
- Different browser widths

The application should be usable with mouse, keyboard, touch, and mobile gestures.

==================================================
01. PRODUCT VISION
==================================================

1. Build a complete habit tracking web application.
2. The primary purpose is helping users create, track, analyze, and maintain daily habits.
3. Users must have individual private accounts.
4. Users must be able to sign in using Google/Gmail authentication.
5. Users must be able to create a new account using Google Sign-In.
6. Returning users must be able to sign in using the same Google account.
7. User data must remain isolated between accounts.
8. Users must be able to create unlimited or configurable numbers of habits.
9. Users must be able to track habits by day.
10. Users must be able to see daily progress.
11. Users must be able to see weekly progress.
12. Users must be able to see monthly progress.
13. Users must be able to see overall progress.
14. Users must be able to analyze habit consistency.
15. Users must be able to edit habits.
16. Users must be able to archive habits.
17. Users must be able to delete habits.
18. Users must be able to restore archived habits if appropriate.
19. Users must be able to configure habit goals.
20. Users must be able to customize their dashboard.

==================================================
02. TECH STACK
==================================================

21. Use React.
22. Prefer Vite for the React project.
23. Use modern JavaScript or TypeScript.
24. Prefer TypeScript for production-quality type safety.
25. Use React functional components.
26. Use React hooks.
27. Avoid unnecessary class components.
28. Use a clean component architecture.
29. Use React Router for routing.
30. Use Firebase Authentication.
31. Use Google OAuth authentication.
32. Use Firebase Firestore as the primary database.
33. Use Firebase Storage only if profile images or uploaded assets require it.
34. Use environment variables for Firebase configuration.
35. Never hard-code secret credentials.
36. Use a charting library such as Recharts for analytics.
37. Use Lucide React or another clean icon library.
38. Use a modern CSS system.
39. Tailwind CSS may be used if appropriate.
40. Keep dependencies reasonable and production-friendly.

==================================================
03. PROJECT ARCHITECTURE
==================================================

41. Create a scalable folder structure.
42. Separate pages from reusable components.
43. Separate UI components from business logic.
44. Separate Firebase configuration from application logic.
45. Create authentication services.
46. Create database services.
47. Create habit services.
48. Create analytics utilities.
49. Create reusable chart components.
50. Create reusable modal components.
51. Create reusable form components.
52. Create reusable button components.
53. Create reusable card components.
54. Create reusable loading components.
55. Create reusable empty-state components.
56. Create reusable error-state components.
57. Create reusable confirmation dialogs.
58. Keep components small and maintainable.
59. Avoid massive single-file React components.
60. Use clear naming conventions.

==================================================
04. AUTHENTICATION
==================================================

61. Create a dedicated landing/login experience.
62. Show a polished authentication screen.
63. Add "Continue with Google".
64. Use Firebase Google Authentication.
65. Handle first-time Google users automatically.
66. Handle returning Google users automatically.
67. Store the authenticated user's UID.
68. Store display name.
69. Store email.
70. Store profile photo URL if available.
71. Create a user document in Firestore on first login.
72. Do not duplicate user documents.
73. Use UID as the primary user identifier.
74. Redirect authenticated users to the dashboard.
75. Redirect unauthenticated users away from private routes.
76. Persist authentication state.
77. Show loading while authentication state is being determined.
78. Handle popup authentication errors gracefully.
79. Handle cancelled authentication.
80. Handle network authentication failures.
81. Display useful error messages.
82. Add logout functionality.
83. Confirm logout if appropriate.
84. Do not store Google passwords.
85. Do not implement insecure custom password storage.
86. Use Firebase's secure authentication flow.
87. Add protected routes.
88. Prevent users from accessing another user's data.
89. Make authentication mobile-friendly.
90. Make authentication visually consistent with the dashboard.

==================================================
05. LANDING PAGE
==================================================

91. Create a modern landing page.
92. Use a clean hero section.
93. Explain what the application does.
94. Add a strong primary CTA.
95. Primary CTA should say something like "Get Started".
96. Add Google Sign-In CTA.
97. Add a short product description.
98. Include a visual preview of the dashboard.
99. Add a feature section.
100. Explain daily habit tracking.
101. Explain progress analytics.
102. Explain streak tracking.
103. Explain customizable habits.
104. Explain privacy.
105. Add a responsive footer.
106. Keep the landing page visually lightweight.
107. Avoid excessive marketing content.
108. Prioritize usability.
109. Add subtle animations.
110. Respect prefers-reduced-motion.

==================================================
06. DASHBOARD
==================================================

111. Create a main dashboard after login.
112. Dashboard should immediately show today's progress.
113. Show the current date.
114. Show the current month.
115. Show a greeting using the user's name.
116. Show profile avatar.
117. Add navigation.
118. Navigation should work on desktop.
119. Navigation should collapse on mobile.
120. Use a sidebar on desktop if appropriate.
121. Use bottom navigation or a compact navigation system on mobile.
122. Dashboard should contain summary cards.
123. Show today's completion percentage.
124. Show total habits.
125. Show completed habits.
126. Show remaining habits.
127. Show current streak.
128. Show best streak.
129. Show weekly completion.
130. Show monthly completion.
131. Use visually clear progress indicators.
132. Avoid overwhelming the user with information.
133. Prioritize today's actions.

==================================================
07. HABIT MANAGEMENT
==================================================

134. Create an "Add Habit" button.
135. Add Habit should open a polished modal or dedicated page.
136. Habit creation should include habit name.
137. Include optional description.
138. Include emoji/icon selection.
139. Include color selection.
140. Include frequency selection.
141. Include target days.
142. Include goal value where applicable.
143. Include start date.
144. Include optional end date.
145. Include reminder preference.
146. Include category.
147. Include priority.
148. Validate required fields.
149. Show inline validation.
150. Prevent accidental empty habits.
151. Save the habit to Firestore.
152. Show a success notification.
153. Immediately update the dashboard.
154. Allow editing existing habits.
155. Allow changing habit icons.
156. Allow changing habit colors.
157. Allow changing habit schedules.
158. Allow changing goals.
159. Allow archiving habits.
160. Allow deleting habits.
161. Ask for confirmation before destructive deletion.
162. Use soft delete/archive where appropriate.

==================================================
08. HABIT DATA MODEL
==================================================

163. Create a scalable Firestore data model.
164. Each user should have a private user document.
165. Store habits under the authenticated user's namespace.
166. Store habit metadata separately from completion records where practical.
167. Habit object should contain an ID.
168. Habit object should contain userId.
169. Habit object should contain name.
170. Habit object should contain description.
171. Habit object should contain icon.
172. Habit object should contain color.
173. Habit object should contain frequency.
174. Habit object should contain goal.
175. Habit object should contain startDate.
176. Habit object should contain endDate if applicable.
177. Habit object should contain createdAt.
178. Habit object should contain updatedAt.
179. Habit object should contain archived state.
180. Completion records should contain date.
181. Completion records should contain completed state.
182. Completion records should contain timestamps where useful.
183. Design the schema for efficient querying.
184. Avoid unnecessary duplicated data.
185. Use Firestore timestamps.
186. Use indexes where needed.
187. Handle timezone correctly.

==================================================
09. DAILY TRACKING
==================================================

188. Create a daily habit tracking interface.
189. Display habits for the selected date.
190. Default to today's date.
191. Allow changing the date.
192. Allow navigating to previous day.
193. Allow navigating to next day.
194. Provide a "Today" button.
195. Allow checking off a habit.
196. Allow unchecking a habit.
197. Make the checkbox touch-friendly.
198. Animate completion.
199. Show completed state clearly.
200. Use accessible checkbox controls.
201. Prevent accidental double submissions.
202. Save completion state immediately.
203. Use optimistic UI where safe.
204. Handle Firestore failures gracefully.
205. Revert optimistic changes when saving fails.
206. Show a subtle success state.
207. Do not reload the entire page after checking a habit.
208. Update statistics instantly.
209. Update charts instantly.
210. Update streak calculations instantly.

==================================================
10. CALENDAR VIEW
==================================================

211. Create a calendar-style habit tracker.
212. Provide month navigation.
213. Show weekdays.
214. Show dates.
215. Highlight today.
216. Highlight selected date.
217. Show completion indicators.
218. Use compact visual indicators on mobile.
219. Use larger cells on desktop.
220. Allow users to click a date.
221. Clicking a date should update the habit list.
222. Allow month switching.
223. Prevent confusing date transitions.
224. Correctly handle different month lengths.
225. Correctly handle leap years.
226. Correctly handle timezone boundaries.
227. Use user's local timezone.
228. Do not incorrectly shift completion dates because of UTC conversion.

==================================================
11. WEEKLY TRACKING
==================================================

229. Create weekly progress visualization.
230. Display Monday-Sunday or configurable week start.
231. Show completion percentage.
232. Show completed count.
233. Show target count.
234. Show remaining count.
235. Show daily completion bars.
236. Allow switching between weeks.
237. Highlight current day.
238. Show weekly streak information.
239. Show habits completed during the week.
240. Show habits missed during the week.
241. Make the weekly UI responsive.

==================================================
12. MONTHLY TRACKING
==================================================

242. Create monthly analytics.
243. Show current month.
244. Allow previous month navigation.
245. Allow next month navigation.
246. Show monthly completion percentage.
247. Show completed habit instances.
248. Show missed habit instances.
249. Show total scheduled instances.
250. Show daily completion trend.
251. Show strongest days.
252. Show weakest days as factual statistics without judgment.
253. Show monthly streak.
254. Show habit-level monthly statistics.
255. Use charts.
256. Use responsive charts.
257. Charts must resize correctly.
258. Do not allow chart overflow on mobile.

==================================================
13. OVERVIEW SECTION
==================================================

259. Create a dashboard overview inspired by the spreadsheet screenshot.
260. Include a "Global Progress" section.
261. Show daily completion bars.
262. Show completed count.
263. Show goal count.
264. Show remaining count.
265. Show weekly percentage.
266. Show monthly percentage.
267. Show overall percentage.
268. Use modern cards instead of spreadsheet cells.
269. Maintain the information density of the reference.
270. Improve readability dramatically.
271. Use whitespace effectively.
272. Use visual hierarchy.
273. Avoid tiny text.
274. Avoid excessive borders.
275. Use rounded cards.
276. Use subtle shadows.
277. Keep the UI professional.

==================================================
14. TOP HABITS
==================================================

278. Create a "Top Habits" section.
279. Show the user's most consistent habits.
280. Use actual calculated data.
281. Do not hard-code rankings.
282. Display completion percentage.
283. Display completion count.
284. Display current streak.
285. Allow clicking a habit.
286. Open habit details.
287. Show icon and habit name.
288. Make this section responsive.
289. On mobile, convert it into a scrollable or stacked card layout.

==================================================
15. PROGRESS CHARTS
==================================================

290. Add a monthly progress line chart.
291. Add daily completion chart.
292. Add weekly completion chart.
293. Add habit comparison chart.
294. Add progress donut chart.
295. Show completed versus remaining.
296. Use tooltips.
297. Tooltips must show exact values.
298. Charts must use real user data.
299. Do not use fake static chart data after implementation.
300. Handle empty datasets gracefully.
301. Display useful empty states.
302. Animate charts subtly.
303. Keep animations short.
304. Disable excessive animation on low-power devices if practical.

==================================================
16. STREAK SYSTEM
==================================================

305. Calculate current streak.
306. Calculate longest streak.
307. Calculate habit-specific streak.
308. Calculate overall streak.
309. Handle missed days correctly.
310. Handle scheduled-only habits correctly.
311. Do not count days where a habit was not scheduled.
312. Handle future dates correctly.
313. Do not count future dates as missed.
314. Display streak in a visually understandable way.
315. Show streak milestones.
316. Avoid manipulative gamification.
317. Allow users to understand how the streak was calculated.

==================================================
17. HABIT FREQUENCY
==================================================

318. Support daily habits.
319. Support weekly habits.
320. Support selected weekdays.
321. Support custom frequency.
322. Support multiple days per week.
323. Support habits with target counts.
324. Example: Drink water 3 times per day.
325. Example: Workout 5 days per week.
326. Example: Study 1 hour per day.
327. Correctly calculate completion for each frequency.
328. Do not mark unscheduled days as failures.
329. Allow users to modify frequency later.
330. Preserve historical records.

==================================================
18. HABIT CATEGORIES
==================================================

331. Add categories.
332. Example categories:
333. Health.
334. Fitness.
335. Study.
336. Productivity.
337. Finance.
338. Mindfulness.
339. Personal.
340. Custom.
341. Allow custom categories.
342. Allow category filtering.
343. Show category icons.
344. Show category colors.
345. Allow category management.

==================================================
19. HABIT DETAIL PAGE
==================================================

346. Create a dedicated habit detail page.
347. Show habit name.
348. Show habit icon.
349. Show habit description.
350. Show current streak.
351. Show longest streak.
352. Show completion percentage.
353. Show weekly trend.
354. Show monthly trend.
355. Show calendar heatmap.
356. Show historical completion.
357. Show habit schedule.
358. Show created date.
359. Provide edit button.
360. Provide archive button.
361. Provide delete button.
362. Provide back navigation.

==================================================
20. HEATMAP
==================================================

363. Create a GitHub-style activity heatmap.
364. Each square represents a date.
365. Use intensity based on completion.
366. Show empty days.
367. Show completed days.
368. Show partial completion.
369. Provide tooltips.
370. Make it horizontally scrollable on mobile.
371. Make it responsive on desktop.
372. Ensure accessible color contrast.
373. Do not rely solely on color.
374. Include textual tooltip information.

==================================================
21. NOTIFICATIONS
==================================================

375. Create a notification/toast system.
376. Show success notifications.
377. Show error notifications.
378. Show save notifications where appropriate.
379. Avoid excessive notifications.
380. Notifications should disappear automatically.
381. Allow important errors to remain visible.
382. Make notifications accessible.
383. Do not interrupt workflow unnecessarily.

==================================================
22. REMINDERS
==================================================

384. Add optional habit reminders.
385. Allow reminder time selection.
386. Allow reminders to be enabled/disabled.
387. Store reminder preferences.
388. Design the system so browser notifications can be added later.
389. Request notification permission only after user action.
390. Never request notification permission immediately on page load.
391. Gracefully handle denied permissions.

==================================================
23. SEARCH AND FILTER
==================================================

392. Add habit search.
393. Add category filter.
394. Add active/archived filter.
395. Add completion filter.
396. Allow sorting.
397. Sort by name.
398. Sort by completion.
399. Sort by streak.
400. Sort by creation date.
401. Make filters responsive.
402. Provide a clear reset filters option.

==================================================
24. SETTINGS
==================================================

403. Create a settings page.
404. Display account information.
405. Display Google profile information.
406. Allow profile display name customization if desired.
407. Allow theme selection.
408. Allow light theme.
409. Allow dark theme.
410. Allow system theme.
411. Allow week-start preference.
412. Allow timezone preference if needed.
413. Allow notification preferences.
414. Allow data export.
415. Allow account logout.
416. Add account deletion option.
417. Confirm destructive actions.
418. Clearly explain destructive actions.

==================================================
25. DARK MODE
==================================================

419. Implement a polished dark mode.
420. Do not simply invert colors.
421. Design dark surfaces intentionally.
422. Maintain readable contrast.
423. Ensure charts work in dark mode.
424. Ensure dialogs work in dark mode.
425. Ensure inputs work in dark mode.
426. Ensure calendar works in dark mode.
427. Persist theme preference.
428. Respect system theme by default.

==================================================
26. RESPONSIVE DESIGN
==================================================

429. Desktop layout should use available horizontal space.
430. Tablet layout should rearrange intelligently.
431. Mobile layout should be completely redesigned where necessary.
432. Do not simply shrink desktop components.
433. Avoid horizontal page scrolling.
434. Tables should become cards or horizontally scrollable components.
435. Charts should resize.
436. Buttons should remain touch-friendly.
437. Minimum touch target should be approximately 44x44px.
438. Navigation should be mobile-friendly.
439. Modals should fit small screens.
440. Forms should become single-column on mobile.
441. Dashboard cards should stack naturally.
442. Avoid tiny fonts.
443. Avoid excessive dense information on mobile.
444. Use responsive breakpoints consistently.

==================================================
27. MOBILE UX
==================================================

445. Optimize specifically for Android phones.
446. Optimize specifically for iPhones.
447. Support portrait orientation.
448. Support landscape orientation.
449. Make checkbox interactions comfortable.
450. Avoid hover-dependent functionality.
451. Provide visible pressed states.
452. Avoid accidental taps.
453. Avoid fixed elements covering content.
454. Handle browser safe areas where appropriate.
455. Make bottom navigation thumb-friendly.
456. Make scrolling smooth.
457. Avoid unnecessary animations on mobile.

==================================================
28. UI DESIGN
==================================================

458. Create a modern SaaS visual language.
459. Use consistent spacing.
460. Use consistent typography.
461. Use a strong heading hierarchy.
462. Use rounded cards.
463. Use subtle borders.
464. Use subtle shadows.
465. Use restrained colors.
466. Use one primary accent color.
467. Use semantic success/error/warning colors.
468. Keep the interface clean.
469. Avoid visual clutter.
470. Avoid excessive gradients.
471. Avoid excessive glassmorphism.
472. Avoid unnecessary decorative elements.
473. Make progress visually obvious.
474. Use icons consistently.
475. Use tooltips where icons are ambiguous.

==================================================
29. REFERENCE SCREENSHOT TRANSLATION
==================================================

476. Use the uploaded screenshots as design inspiration.
477. Preserve the concept of weekly sections.
478. Preserve the concept of daily tracking.
479. Preserve global progress.
480. Preserve completed/goal/left statistics.
481. Preserve weekly progress percentages.
482. Preserve monthly progress.
483. Preserve top habits.
484. Preserve overall progress.
485. Preserve visual habit completion.
486. But DO NOT reproduce the spreadsheet appearance literally.
487. Replace spreadsheet-style borders with modern cards.
488. Replace tiny spreadsheet controls with accessible controls.
489. Replace spreadsheet dropdowns with modern selects.
490. Replace dense grid layouts with responsive components.
491. Preserve information hierarchy.
492. Improve readability.
493. Improve usability.
494. Improve mobile experience.
495. Make the result feel like a real SaaS product.

==================================================
30. ACCESSIBILITY
==================================================

496. Use semantic HTML.
497. Use accessible buttons.
498. Use accessible labels.
499. Use aria-labels where needed.
500. Keyboard navigation must work.
501. Focus states must be visible.
502. Dialogs must trap focus appropriately.
503. Escape should close dialogs where appropriate.
504. Screen readers should understand controls.
505. Do not use color as the only information source.
506. Maintain adequate contrast.
507. Support reduced motion.
508. Avoid inaccessible custom controls.

==================================================
31. PERFORMANCE
==================================================

509. Avoid unnecessary re-renders.
510. Use memoization only where beneficial.
511. Lazy load non-critical pages.
512. Avoid loading unnecessary libraries.
513. Optimize chart rendering.
514. Optimize Firestore queries.
515. Avoid repeated database requests.
516. Cache suitable data.
517. Use realtime listeners only where useful.
518. Unsubscribe listeners correctly.
519. Clean up effects.
520. Avoid memory leaks.
521. Keep initial page load fast.

==================================================
32. FIRESTORE SECURITY
==================================================

522. Create proper Firestore security rules.
523. Users can read only their own data.
524. Users can write only their own data.
525. Users cannot access another user's habits.
526. Users cannot modify another user's profile.
527. Validate authenticated user identity.
528. Do not trust userId supplied by the frontend.
529. Use request.auth.uid for authorization.
530. Protect all private collections.
531. Document the security model.
532. Test unauthorized access scenarios.

==================================================
33. ERROR HANDLING
==================================================

533. Handle Firebase initialization failures.
534. Handle authentication errors.
535. Handle Firestore errors.
536. Handle offline state.
537. Handle invalid form data.
538. Handle missing documents.
539. Handle deleted habits.
540. Handle expired authentication.
541. Provide friendly error messages.
542. Do not expose sensitive technical information to users.
543. Log useful debugging information during development.

==================================================
34. OFFLINE EXPERIENCE
==================================================

544. Design for intermittent internet.
545. Show offline status when possible.
546. Avoid blank screens when network fails.
547. Preserve local UI state temporarily.
548. Use Firestore offline capabilities where appropriate.
549. Synchronize changes when connectivity returns.
550. Handle conflicting changes gracefully.

==================================================
35. EMPTY STATES
==================================================

551. Create an empty dashboard state.
552. Create an empty habit state.
553. Create an empty analytics state.
554. Create an empty search state.
555. Create an empty archive state.
556. Provide useful CTA buttons.
557. Avoid showing confusing blank charts.
558. Explain what the user can do next.

==================================================
36. LOADING STATES
==================================================

559. Add skeleton loaders.
560. Use skeletons instead of unnecessary spinners.
561. Show loading state for dashboard data.
562. Show loading state for habit creation.
563. Show loading state for analytics.
564. Show authentication loading.
565. Prevent layout jumping.
566. Avoid showing loading states for extremely short operations.

==================================================
37. CONFIRMATION DIALOGS
==================================================

567. Confirm deleting a habit.
568. Confirm deleting account.
569. Confirm clearing historical data.
570. Explain consequences.
571. Use destructive button styling.
572. Do not place destructive action next to primary action without separation.
573. Allow cancellation.
574. Close dialog safely.

==================================================
38. DATA EXPORT
==================================================

575. Add export functionality.
576. Allow exporting habits.
577. Allow exporting completion history.
578. Support CSV export.
579. Consider JSON export.
580. Use user-friendly filenames.
581. Do not upload exported data anywhere.
582. Generate exports client-side where practical.

==================================================
39. DATA PRIVACY
==================================================

583. Do not expose user data publicly.
584. Do not expose Firestore credentials.
585. Do not store passwords manually.
586. Do not send habit data to third-party analytics by default.
587. Minimize unnecessary data collection.
588. Provide account deletion.
589. Provide data export.
590. Clearly explain privacy-related behavior.

==================================================
40. ANALYTICS CALCULATIONS
==================================================

591. Calculate total scheduled habit instances.
592. Calculate completed instances.
593. Calculate remaining instances.
594. Calculate completion percentage.
595. Calculate weekly completion.
596. Calculate monthly completion.
597. Calculate daily completion.
598. Calculate habit-specific completion.
599. Calculate streaks.
600. Calculate historical trends.
601. Calculate category statistics.
602. Handle zero-goal cases safely.
603. Avoid division-by-zero.
604. Round percentages consistently.
605. Keep calculation logic centralized.

==================================================
41. DATE HANDLING
==================================================

606. Create centralized date utilities.
607. Never scatter date calculations throughout components.
608. Store dates consistently.
609. Use local calendar dates correctly.
610. Avoid accidental UTC date shifts.
611. Test month boundaries.
612. Test year boundaries.
613. Test leap years.
614. Test daylight-saving transitions where relevant.
615. Handle India timezone correctly for local users.
616. Make timezone architecture extensible.

==================================================
42. DASHBOARD PERSONALIZATION
==================================================

617. Allow users to customize visible dashboard sections.
618. Allow hiding sections.
619. Allow showing sections.
620. Save dashboard preferences.
621. Keep sensible defaults.
622. Do not overwhelm users with customization initially.

==================================================
43. GAMIFICATION
==================================================

623. Add optional milestones.
624. Add streak milestones.
625. Add completion milestones.
626. Example: 7-day consistency milestone.
627. Example: 30 completed habit instances.
628. Keep gamification optional.
629. Do not use manipulative language.
630. Do not punish users for missing habits.
631. Focus on useful feedback.

==================================================
44. MICROINTERACTIONS
==================================================

632. Animate checkbox completion.
633. Animate progress changes subtly.
634. Animate modal opening.
635. Animate modal closing.
636. Animate navigation where appropriate.
637. Use short transitions.
638. Avoid excessive bouncing.
639. Avoid distracting animations.
640. Support reduced-motion settings.

==================================================
45. COMPONENTS
==================================================

641. Build AppShell.
642. Build Sidebar.
643. Build MobileNavigation.
644. Build Header.
645. Build UserMenu.
646. Build HabitCard.
647. Build HabitGrid.
648. Build HabitCheckbox.
649. Build AddHabitModal.
650. Build EditHabitModal.
651. Build DeleteConfirmation.
652. Build ProgressCard.
653. Build ProgressRing.
654. Build WeeklyChart.
655. Build MonthlyChart.
656. Build ProgressDonut.
657. Build Heatmap.
658. Build Calendar.
659. Build HabitDetails.
660. Build EmptyState.
661. Build LoadingSkeleton.
662. Build Toast.
663. Build SearchBar.
664. Build FilterBar.
665. Build SettingsPanel.

==================================================
46. ROUTES
==================================================

666. Create landing route.
667. Create login route if needed.
668. Create dashboard route.
669. Create habits route.
670. Create calendar route.
671. Create analytics route.
672. Create habit detail route.
673. Create settings route.
674. Create archive route if useful.
675. Create 404 page.
676. Protect private routes.
677. Redirect authenticated users appropriately.

==================================================
47. DASHBOARD LAYOUT
==================================================

678. Desktop dashboard should use a structured grid.
679. Sidebar should remain stable.
680. Main content should scroll independently where appropriate.
681. Header should remain accessible.
682. Progress summary should be near the top.
683. Today's habits should be prominent.
684. Analytics should appear below daily actions.
685. Avoid putting all information above the fold.
686. Use progressive information density.

==================================================
48. DAILY HABIT CARD
==================================================

687. Show habit icon.
688. Show habit name.
689. Show description optionally.
690. Show today's target.
691. Show completion state.
692. Show streak.
693. Show category.
694. Provide quick completion.
695. Provide overflow menu.
696. Overflow menu should contain edit/archive/delete as appropriate.
697. Make the entire card visually interactive without making every area a button.

==================================================
49. CHECKBOX BEHAVIOR
==================================================

698. Checkbox should have clear unchecked state.
699. Checkbox should have clear checked state.
700. Use animation.
701. Update data immediately.
702. Prevent duplicate click events.
703. Ensure keyboard accessibility.
704. Ensure mobile touch support.
705. Make the checked state visually obvious.

==================================================
50. MULTI-COMPLETION HABITS
==================================================

706. Support habits such as drinking water multiple times per day.
707. Allow target counts.
708. Display progress such as 2/3.
709. Allow increment.
710. Allow decrement.
711. Prevent negative counts.
712. Show completed state when target is reached.
713. Calculate partial completion correctly.
714. Include partial completion in analytics appropriately.

==================================================
51. SEARCH
==================================================

715. Search should be instant.
716. Search by habit name.
717. Search by category.
718. Search by description if appropriate.
719. Show no-results state.
720. Allow clearing search.
721. Keep search responsive.

==================================================
52. FILTERING
==================================================

722. Filter active habits.
723. Filter archived habits.
724. Filter completed today.
725. Filter incomplete today.
726. Filter by category.
727. Filter by frequency.
728. Combine multiple filters.
729. Provide reset filters.

==================================================
53. SORTING
==================================================

730. Sort alphabetically.
731. Sort by completion.
732. Sort by streak.
733. Sort by creation date.
734. Preserve sorting preference if appropriate.

==================================================
54. PROFILE
==================================================

735. Show Google profile image.
736. Show display name.
737. Show email.
738. Show account creation date if available.
739. Provide logout.
740. Provide account settings.
741. Provide account deletion.

==================================================
55. SECURITY UX
==================================================

742. Never expose Firebase admin credentials.
743. Never put service account keys in frontend.
744. Never expose private API keys.
745. Use environment variables.
746. Validate Firebase configuration.
747. Use HTTPS in production.
748. Secure Firestore rules.
749. Avoid dangerous HTML injection.
750. Sanitize user-generated content where necessary.

==================================================
56. ACCESSIBILITY TESTING
==================================================

751. Test keyboard navigation.
752. Test tab order.
753. Test focus states.
754. Test screen reader labels.
755. Test contrast.
756. Test mobile touch.
757. Test reduced motion.
758. Test zoom up to 200%.
759. Ensure content remains usable at high zoom.

==================================================
57. BROWSER SUPPORT
==================================================

760. Support modern Chrome.
761. Support Edge.
762. Support Firefox.
763. Support Safari.
764. Support modern Android Chrome.
765. Support iOS Safari.
766. Avoid unnecessary browser-specific hacks.

==================================================
58. PERFORMANCE TESTING
==================================================

767. Test with 5 habits.
768. Test with 20 habits.
769. Test with 50 habits.
770. Test with 100 habits.
771. Test with large completion histories.
772. Ensure dashboard remains responsive.
773. Avoid excessive Firestore reads.
774. Avoid unnecessary chart calculations.

==================================================
59. RESPONSIVE BREAKPOINT TESTING
==================================================

775. Test 320px width.
776. Test 360px width.
777. Test 390px width.
778. Test 430px width.
779. Test 768px width.
780. Test 1024px width.
781. Test 1280px width.
782. Test 1440px width.
783. Test ultrawide screens.
784. Ensure no horizontal overflow.

==================================================
60. FORM UX
==================================================

785. Forms must be simple.
786. Labels must be clear.
787. Use appropriate input types.
788. Validate on submit.
789. Provide useful validation messages.
790. Preserve valid input when an error occurs.
791. Disable submit while saving.
792. Prevent duplicate submission.
793. Allow cancellation.
794. Close successful forms cleanly.

==================================================
61. DESIGN SYSTEM
==================================================

795. Define spacing tokens.
796. Define typography tokens.
797. Define border radius tokens.
798. Define shadow tokens.
799. Define color tokens.
800. Define breakpoint tokens.
801. Reuse tokens consistently.
802. Avoid random values throughout the application.

==================================================
62. COLOR SYSTEM
==================================================

803. Use a calm primary color.
804. Use neutral background colors.
805. Use semantic success colors.
806. Use semantic warning colors.
807. Use semantic error colors.
808. Ensure dark-mode equivalents.
809. Ensure sufficient contrast.
810. Do not use too many colors.

==================================================
63. TYPOGRAPHY
==================================================

811. Use a modern sans-serif font.
812. Make headings prominent.
813. Make body text readable.
814. Use consistent font weights.
815. Avoid excessively small labels.
816. Use tabular numbers for statistics if appropriate.
817. Ensure charts have readable labels.

==================================================
64. TABLE / GRID REPLACEMENT
==================================================

818. The reference screenshot uses a spreadsheet-like grid.
819. Recreate the information architecture, not the spreadsheet limitations.
820. On desktop, a habit matrix may be used.
821. On mobile, transform the matrix into cards.
822. Allow horizontal scrolling only where genuinely useful.
823. Keep the current day visually emphasized.
824. Keep completion states easy to scan.

==================================================
65. NOTIFICATION DESIGN
==================================================

825. Toasts should not block important controls.
826. Toasts should be dismissible.
827. Use consistent positioning.
828. Mobile toast positioning must account for bottom navigation.
829. Error messages should explain what happened.
830. Avoid technical jargon.

==================================================
66. ERROR PAGES
==================================================

831. Create 404 page.
832. Create generic error fallback.
833. Create authentication error state.
834. Create database error state.
835. Provide retry buttons.
836. Provide navigation back to dashboard.

==================================================
67. ONBOARDING
==================================================

837. After first login, detect a new user.
838. Show lightweight onboarding.
839. Ask what the user wants to track.
840. Allow skipping onboarding.
841. Offer example habits.
842. Example:
843. Wake up at 6 AM.
844. Drink water.
845. Workout.
846. Study.
847. Meditation.
848. No social media.
849. Track expenses.
850. Allow users to create their own habits.

==================================================
68. DEFAULT HABITS
==================================================

851. Do not force default habits.
852. Offer optional templates.
853. Templates should be editable.
854. Templates should not be permanently hard-coded into user data without confirmation.
855. Allow selecting multiple templates.

==================================================
69. ANALYTICS PAGE
==================================================

856. Create a dedicated analytics page.
857. Show overview statistics.
858. Show completion trend.
859. Show streaks.
860. Show habit comparison.
861. Show category breakdown.
862. Show calendar heatmap.
863. Allow date range selection.
864. Allow week/month/custom range.
865. Make all analytics responsive.

==================================================
70. DATA CONSISTENCY
==================================================

866. Ensure dashboard and analytics use the same source of truth.
867. Avoid different calculations in different components.
868. Centralize analytics functions.
869. Add unit tests for calculations.
870. Test edge cases.

==================================================
71. UNIT TESTING
==================================================

871. Test percentage calculations.
872. Test streak calculations.
873. Test weekly calculations.
874. Test monthly calculations.
875. Test frequency calculations.
876. Test multi-completion habits.
877. Test date boundaries.
878. Test zero-data states.
879. Test authentication guards.

==================================================
72. FIREBASE TESTING
==================================================

880. Test Google authentication.
881. Test new user creation.
882. Test returning user login.
883. Test logout.
884. Test habit creation.
885. Test habit editing.
886. Test habit deletion.
887. Test completion updates.
888. Test Firestore security rules.

==================================================
73. REAL DATA
==================================================

889. Do not leave dashboard charts permanently populated with mock data.
890. Use mock data only during initial development if necessary.
891. Clearly separate development seed data from production data.
892. After Firebase integration, all user-specific statistics must come from Firestore.

==================================================
74. SEED DATA
==================================================

893. Optionally provide development seed data.
894. Seed data must belong to a development/test user.
895. Do not accidentally seed every production account.
896. Provide a clean way to remove seed data.

==================================================
75. CODE QUALITY
==================================================

897. Use TypeScript types/interfaces.
898. Avoid any unless absolutely necessary.
899. Avoid duplicated logic.
900. Avoid giant components.
901. Avoid deeply nested JSX.
902. Use descriptive variable names.
903. Use descriptive function names.
904. Keep functions focused.
905. Add comments only where useful.
906. Do not add unnecessary comments.
907. Keep code readable.

==================================================
76. ENVIRONMENT CONFIGURATION
==================================================

908. Create .env.example.
909. Document required Firebase variables.
910. Never commit .env secrets.
911. Make development setup easy.
912. Make production setup easy.
913. Clearly document installation commands.

==================================================
77. README
==================================================

914. Create a professional README.
915. Explain the project.
916. Explain features.
917. Explain technology stack.
918. Explain installation.
919. Explain environment variables.
920. Explain Firebase setup.
921. Explain Google authentication setup.
922. Explain Firestore setup.
923. Explain deployment.
924. Explain testing.
925. Explain project structure.

==================================================
78. FIREBASE SETUP DOCUMENTATION
==================================================

926. Explain how to create Firebase project.
927. Explain how to enable Google provider.
928. Explain authorized domains.
929. Explain Firestore creation.
930. Explain Firestore rules.
931. Explain environment variables.
932. Explain local development.
933. Explain production deployment.

==================================================
79. DEPLOYMENT
==================================================

934. Prepare for production deployment.
935. Support Vercel deployment or Firebase Hosting.
936. Configure SPA routing correctly.
937. Configure environment variables.
938. Verify Google OAuth authorized domains.
939. Verify Firestore rules.
940. Build successfully in production mode.

==================================================
80. FINAL UI POLISH
==================================================

941. Remove placeholder text.
942. Remove console errors.
943. Remove broken links.
944. Remove unused components.
945. Remove unused imports.
946. Remove unused dependencies.
947. Remove fake production data.
948. Verify every button.
949. Verify every form.
950. Verify every route.
951. Verify logout.
952. Verify authentication.
953. Verify responsive layouts.
954. Verify dark mode.
955. Verify charts.
956. Verify calendar.
957. Verify habit creation.
958. Verify habit editing.
959. Verify habit completion.
960. Verify deletion.
961. Verify analytics.
962. Verify Firestore security.
963. Verify loading states.
964. Verify error states.

==================================================
81. FINAL PRODUCT EXPERIENCE
==================================================

965. The final application should feel like a polished commercial product.
966. It should not feel like a college project.
967. It should not look like a spreadsheet converted to HTML.
968. It should feel like a modern habit-tracking SaaS application.
969. The first screen after login should clearly answer:
970. "What habits do I need to complete today?"
971. "How much have I completed?"
972. "How am I progressing?"
973. "What is my current streak?"
974. "What should I focus on next?"
975. Keep the primary user action obvious.
976. Make habit completion extremely fast.
977. Make analytics understandable.
978. Keep the interface visually calm.
979. Make mobile usage excellent.
980. Make desktop usage information-rich.
981. Make the application accessible.
982. Make the application secure.
983. Make the application maintainable.
984. Make the application scalable.

==================================================
82. IMPORTANT IMPLEMENTATION RULES
==================================================

985. First inspect the reference screenshots carefully.
986. Identify the information hierarchy from the screenshots.
987. Identify the main components shown in the screenshots.
988. Identify the habit matrix.
989. Identify the progress charts.
990. Identify the monthly overview.
991. Identify the weekly progress sections.
992. Identify the top habits section.
993. Identify the overall progress section.
994. Translate these concepts into modern web UI.
995. Do not copy the spreadsheet literally.
996. Do not use Excel-like UI as the primary experience.
997. Do not use fake buttons.
998. Do not create dead-end screens.
999. Do not create non-functional navigation.
1000. Every major UI interaction must work.

==================================================
83. DEVELOPMENT WORKFLOW
==================================================

1001. Start by planning the architecture.
1002. Then create the React project structure.
1003. Then implement the design system.
1004. Then implement routing.
1005. Then implement authentication.
1006. Then implement Firestore.
1007. Then implement habit CRUD.
1008. Then implement daily tracking.
1009. Then implement analytics.
1010. Then implement responsive layouts.
1011. Then implement dark mode.
1012. Then implement error handling.
1013. Then implement testing.
1014. Then perform UI polish.
1015. Then perform final QA.

==================================================
84. DO NOT STOP AT THE MOCKUP
==================================================

1016. Do not only generate static HTML.
1017. Do not only generate static React components.
1018. Do not leave buttons non-functional.
1019. Do not leave authentication as a placeholder.
1020. Do not leave Firestore as a placeholder.
1021. Do not leave analytics as fake data.
1022. Implement the actual application architecture.
1023. If Firebase configuration is unavailable, create the integration structure and clearly identify the required environment variables.
1024. Make the rest of the application runnable locally.

==================================================
85. FINAL ACCEPTANCE CRITERIA
==================================================

1025. A new user can open the application.
1026. The user can click Continue with Google.
1027. Google authentication works.
1028. A new user gets a private account.
1029. The dashboard opens.
1030. The user can create a habit.
1031. The user can select a schedule.
1032. The habit appears on the dashboard.
1033. The user can complete it.
1034. Completion is saved.
1035. Completion statistics update.
1036. Charts update.
1037. Streak updates.
1038. Calendar updates.
1039. Weekly progress updates.
1040. Monthly progress updates.
1041. The user can edit the habit.
1042. The user can archive the habit.
1043. The user can delete the habit.
1044. The user can search habits.
1045. The user can filter habits.
1046. The user can view analytics.
1047. The user can change theme.
1048. The user can logout.
1049. Another Google account cannot access the first user's data.
1050. The application works on desktop.
1051. The application works on tablet.
1052. The application works on mobile.
1053. No horizontal overflow exists on normal mobile screens.
1054. No major console errors exist.
1055. No broken routes exist.
1056. No fake production functionality remains.

==================================================
86. DESIGN DIRECTION
==================================================

1057. Overall style:
Modern.
Minimal.
Premium.
Clean.
Productivity-focused.
Data-rich but not overwhelming.

1058. Use the uploaded screenshot as inspiration for:
- Habit matrix
- Weekly sections
- Daily tracking
- Progress
- Monthly overview
- Top habits
- Completion statistics

1059. Improve it with:
- Modern cards
- Better spacing
- Better typography
- Better mobile UX
- Better navigation
- Better charts
- Better accessibility
- Better interactions
- Better empty states
- Better loading states
- Better onboarding

1060. Avoid:
- Clutter
- Excessive borders
- Tiny spreadsheet text
- Excessive colors
- Huge unnecessary gradients
- Fake functionality
- Generic dashboard templates
- Poor mobile layouts

==================================================
87. START BUILDING
==================================================

1061. Begin by creating the project architecture.
1062. Inspect the supplied reference screenshots.
1063. Build the application incrementally.
1064. Keep the application runnable after every major phase.
1065. Fix compilation errors immediately.
1066. Fix TypeScript errors immediately.
1067. Fix lint errors where appropriate.
1068. Test each major feature before continuing.
1069. Do not silently skip requirements.
1070. If a requirement conflicts with another requirement, prioritize:
       security > functionality > accessibility > responsiveness > visual polish.

==================================================
88. IMPORTANT USER EXPERIENCE PRINCIPLE
==================================================

1071. The user should be able to complete today's habit in one or two taps.
1072. The dashboard should prioritize action over analytics.
1073. Analytics should help users understand their behavior.
1074. Never make users navigate through multiple screens just to check a habit.
1075. Keep important information visible.
1076. Keep advanced functionality discoverable but unobtrusive.
1077. Use progressive disclosure.
1078. Make the application feel fast.
1079. Make interactions predictable.
1080. Make the application enjoyable to use every day.

==================================================
89. FINAL REQUEST
==================================================

Build the complete application now.

Do not merely describe how it could be built.

Actually create the React project and implement the application.

Use the uploaded screenshots as the primary visual reference for the information architecture.

Create a substantially better modern responsive experience than the spreadsheet.

Use real Firebase Google authentication and Firestore architecture.

Make all major functionality functional.

After implementation:
1. Run the application.
2. Test the major flows.
3. Fix errors.
4. Test responsive layouts.
5. Test authentication flow.
6. Test habit CRUD.
7. Test completion tracking.
8. Test analytics.
9. Test mobile layout.
10. Test desktop layout.
11. Remove obvious bugs.
12. Provide a concise summary of what was implemented and any Firebase configuration values I still need to provide.

Do not stop after creating the initial UI.
Continue until the application is a functional MVP ready for real users.