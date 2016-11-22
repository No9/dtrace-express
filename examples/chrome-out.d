#pragma D option strsize=4k 
#pragma D option quiet
/*{"name": "Asub", "cat": "PERF", "ph": "B", "pid": 22630, "tid": 22630, "ts": 829} , copyinstr(arg0), copyinstr(arg1)*/

BEGIN {
	printf("[");
}
:::trace
/copyinstr(arg1) == "B" || copyinstr(arg1) == "E"/{
	printf("{ \"name\": \"%s\", \"cat\": \"PERF\", \"ph\": \"%s\", \"pid\":%d, \"tid\":%d, \"ts\":%d},\n"
			, copyinstr(arg0), copyinstr(arg1),  pid, tid, arg2); 
}

:::trace 
/copyinstr(arg1) != "B" && copyinstr(arg1) != "E"/{
	printf("{ \"name\": \"%s\", \"cat\": \"PERF\", \"ph\": \"i\", \"pid\":%d, \"tid\":%d, \"ts\":%d},\n"
			, copyinstr(arg0), pid, tid, vtimestamp / 1000); 
}

