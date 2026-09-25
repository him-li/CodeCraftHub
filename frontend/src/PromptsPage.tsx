import { SiteNav } from './components/SiteNav';
import { getLocalizedPromptItem, promptShowcase } from './content/prompts';
import { useLanguage } from './i18n';

export default function PromptsPage() {
	const { locale, t } = useLanguage();
	const localizedPrompts = promptShowcase.map((item) => getLocalizedPromptItem(item, locale));

	return (
		<main className='min-h-screen bg-slate-50 text-slate-900'>
			<header className='relative overflow-hidden bg-slate-950 text-white'>
				<div className='absolute inset-0 bg-[radial-gradient(circle_at_80%_10%,rgba(124,58,237,0.35),transparent_35%),radial-gradient(circle_at_10%_90%,rgba(14,165,233,0.18),transparent_30%)]' />
				<div className='relative'>
					<SiteNav current='prompts' />
					<div className='mx-auto max-w-6xl px-5 pb-20 pt-14 sm:pb-28 sm:pt-20'>
						<p className='text-sm font-bold uppercase tracking-[0.25em] text-violet-300'>
							{t.prompts.eyebrow}
						</p>
						<h1 className='mt-5 max-w-4xl text-4xl font-black tracking-tight sm:text-6xl lg:text-7xl'>
							{t.prompts.title}
						</h1>
						<p className='mt-6 max-w-2xl text-lg leading-8 text-slate-300'>
							{t.prompts.subtitle}
						</p>
						<div className='mt-10 flex flex-wrap gap-3 text-sm font-semibold'>
							<span className='rounded-full border border-white/15 bg-white/5 px-4 py-2'>
								{promptShowcase.length} {t.prompts.stages}
							</span>
							<span className='rounded-full border border-white/15 bg-white/5 px-4 py-2'>
								{t.prompts.humanDirected}
							</span>
							<span className='rounded-full border border-white/15 bg-white/5 px-4 py-2'>
								{t.prompts.evidenceDriven}
							</span>
						</div>
					</div>
				</div>
			</header>

			<div className='mx-auto max-w-6xl space-y-24 px-5 py-16 sm:py-24'>
				<section aria-labelledby='approach-title'>
					<div className='max-w-2xl'>
						<p className='text-sm font-bold uppercase tracking-widest text-violet-600'>
							{t.prompts.approach}
						</p>
						<h2
							id='approach-title'
							className='mt-2 text-3xl font-black tracking-tight sm:text-4xl'
						>
							{t.prompts.approachTitle}
						</h2>
						<p className='mt-4 leading-7 text-slate-600'>
							{t.prompts.approachBody}
						</p>
					</div>
					<div className='mt-10 grid gap-5 md:grid-cols-3'>
						{t.prompts.principles.map(([number, title, description]) => (
							<article
								key={number}
								className='rounded-2xl border border-slate-200 bg-white p-6 shadow-sm'
							>
								<span className='text-sm font-black text-violet-600'>{number}</span>
								<h3 className='mt-5 text-xl font-bold'>{title}</h3>
								<p className='mt-3 text-sm leading-6 text-slate-600'>{description}</p>
							</article>
						))}
					</div>
				</section>

				<section aria-labelledby='prompt-library-title'>
					<div className='flex flex-col justify-between gap-5 sm:flex-row sm:items-end'>
						<div className='max-w-2xl'>
							<p className='text-sm font-bold uppercase tracking-widest text-violet-600'>
								{t.prompts.library}
							</p>
							<h2
								id='prompt-library-title'
								className='mt-2 text-3xl font-black tracking-tight sm:text-4xl'
							>
								{t.prompts.libraryTitle}
							</h2>
						</div>
						<p className='max-w-sm text-sm leading-6 text-slate-500'>
							{t.prompts.editHint}
						</p>
					</div>

					<div className='mt-10 space-y-8'>
						{localizedPrompts.map((item) => (
							<article
								key={item.id}
								className='overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm'
							>
								<div className='grid lg:grid-cols-[0.8fr_1.2fr]'>
									<div className='bg-slate-950 p-7 text-white sm:p-9'>
										<div className='flex items-center justify-between gap-4'>
											<span className='font-mono text-sm font-bold text-violet-300'>
												{t.prompts.promptNumber} {item.id}
											</span>
											<span className='rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-slate-300'>
												{item.phase}
											</span>
										</div>
										<h3 className='mt-8 text-2xl font-black tracking-tight'>
											{item.title}
										</h3>
										<p className='mt-4 text-sm leading-6 text-slate-400'>
											{item.context}
										</p>
										<div className='mt-8 flex flex-wrap gap-2'>
											{item.tags.map((tag) => (
												<span
													key={tag}
													className='rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-slate-300'
												>
													{tag}
												</span>
											))}
										</div>
									</div>
									<div className='space-y-7 p-7 sm:p-9'>
										<div>
											<p className='text-xs font-black uppercase tracking-[0.2em] text-violet-600'>
												{t.prompts.promptLabel}
											</p>
											<pre dir='ltr' className='mt-3 min-h-36 whitespace-pre-wrap rounded-2xl border border-violet-100 bg-violet-50/70 p-5 text-left font-mono text-sm leading-6 text-slate-700'>
												{item.prompt}
											</pre>
										</div>
									</div>
								</div>
							</article>
						))}
					</div>
				</section>

				<section className='rounded-3xl bg-linear-to-br from-violet-600 to-indigo-700 p-8 text-white shadow-2xl shadow-violet-200 sm:p-12'>
					<p className='text-sm font-bold uppercase tracking-[0.2em] text-violet-200'>
					{t.prompts.takeaway}
					</p>
					<blockquote className='mt-5 max-w-4xl text-2xl font-black leading-tight tracking-tight sm:text-4xl'>
					{t.prompts.quote}
					</blockquote>
				</section>
			</div>
		</main>
	);
}
