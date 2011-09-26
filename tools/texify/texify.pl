#!/usr/bin/perl

# Inputs an HTML string with [latex] pseudo-tags, and replaces those tags with
# image tags referencing created images.

use strict;
use warnings;

use Digest::SHA qw/sha256_hex/;

die "TEX2PNG not set" unless $ENV{TEX2PNG};
my $t2p = $ENV{TEX2PNG};
die "TEX2PNG not found" unless -x $t2p;

die "IMGDIR not set" unless $ENV{IMGDIR};
my $imgdir = $ENV{IMGDIR};
mkdir $imgdir unless -e $imgdir;
die "$imgdir is not a directory" unless -d $imgdir;

die "HTMLIMGDIR not set" unless $ENV{HTMLIMGDIR};
my $htmlimgdir = $ENV{HTMLIMGDIR};

my $content = "";
$content .= $_ while <>;

`rm -f "/tmp/texify.log"`;

my %eqns = ();
while ($content =~ m'\[latex\](.*?)\[/latex\]'misg) {
	my $entire = $&;
	next if $eqns{$entire};
	my $latex = $1;
	my $fname = sha256_hex($latex).".png";
	$eqns{$entire} = [$latex, $fname];
	open TEX, "| $t2p -i -T -o $imgdir/$fname >> /tmp/texify.log";
	print TEX "\$$latex\$";
	close TEX;
}

for my $t (keys %eqns) {
	my ($latex, $fname) = @{$eqns{$t}};
	$t =~ s/([\[\]\(\)\^\$\^\.\*\+\?\{\}\\])/\\$1/g;
	$content =~ s/$t/<img src="$htmlimgdir\/$fname" title="$latex" \/>/g;
}

print $content;

