#!/usr/bin/perl
use strict;
use warnings;

my $lname = "Bar";
print "$lname\n";        # Bar

sub foo { print "$x\n"; }
{ local $x = 456; foo(); }  # 456

{
    print "$lname\n";    # Bar
    $lname = "Other";
    my $foo " foo";
    print "$lname\n";    # Other
}
print "$lname\n";        # Other
