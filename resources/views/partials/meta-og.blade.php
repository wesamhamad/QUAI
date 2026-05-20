{{-- Shared social/link-preview meta (Open Graph + Twitter Card) and favicons.
     Include in the <head> of any public-facing page. Override per page with:
       @include('partials.meta-og', [
         'ogTitle'       => '...',
         'ogDescription' => '...',
         'ogUrl'         => '...',   // optional, defaults to current URL
       ])
     The preview image lives at public/images/og-preview.png — regenerate it
     by re-running the Puppeteer snippet documented in the PR. Bump ?v= when
     the image changes so WhatsApp/Twitter drop their cached copy. --}}
@php
    $ogTitle       = $ogTitle       ?? __('messages.og_title_default');
    $ogDescription = $ogDescription ?? __('messages.og_description_default');
    $ogUrl         = $ogUrl         ?? url()->current();
    $ogImage       = asset('images/og-preview.png') . '?v=1';
    $__ogLocale    = app()->getLocale() === 'en' ? 'en_US' : 'ar_SA';
@endphp

{{-- Open Graph (WhatsApp, Facebook, LinkedIn, iMessage) --}}
<meta property="og:type" content="website">
<meta property="og:site_name" content="{{ __('messages.og_site_name') }}">
<meta property="og:locale" content="{{ $__ogLocale }}">
<meta property="og:title" content="{{ $ogTitle }}">
<meta property="og:description" content="{{ $ogDescription }}">
<meta property="og:url" content="{{ $ogUrl }}">
<meta property="og:image" content="{{ $ogImage }}">
<meta property="og:image:secure_url" content="{{ $ogImage }}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="{{ __('messages.og_image_alt') }}">

{{-- Twitter Card --}}
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="{{ $ogTitle }}">
<meta name="twitter:description" content="{{ $ogDescription }}">
<meta name="twitter:image" content="{{ $ogImage }}">

{{-- Generic SEO + favicons (public/favicon.ico ships empty) --}}
<meta name="description" content="{{ $ogDescription }}">
<link rel="icon" type="image/png" href="{{ asset('images/qu-icon.png') }}">
<link rel="apple-touch-icon" href="{{ asset('images/qu-icon.png') }}">
