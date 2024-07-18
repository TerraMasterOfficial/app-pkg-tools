target=TOS6_APP_HelloWorld

init:
	go mod tidy

clean:
	@rm -f ${target}*

amd64: clean init
	@env CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -ldflags "-s -w" -o ${target}-amd64
	upx --best --lzma -9 -f -o ./${target} ./${target}-amd64
	cp -a ${target} ../output/sbin/${target}

arm64: clean init
	@env CGO_ENABLED=0 GOOS=linux GOARCH=arm64 GOARM=7 go build -ldflags "-s -w" -o ${target}-arm64
	upx --best --lzma -9 -f -o ./${target} ./${target}-arm64
	cp -a ${target} ../output/sbin/${target}