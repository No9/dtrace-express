#pragma D option strsize=4k 
#pragma D option quiet
:::trace { printf("%s\n", copyinstr(arg1));}
