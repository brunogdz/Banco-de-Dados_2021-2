#include <stdio.h>

int main () {
	int a;
	//printf("Digite um inteiro: ");
	scanf("%d", &a);
	
	if (a >= 0) 
		//printf("O valor absoluto de %d é %d\n", a, a);
		printf("%d", a);
	else
		//printf("O valor absoluto de %d é %d\n", a, -a);
		printf("%d", -a);
}
