package main

import (
	"flag"
	"github.com/gin-gonic/gin"
	"gitlab.local/golibrary/resp"
	"golang.org/x/sys/unix"
	"log"
	"os"
	"os/exec"
	"os/signal"
)

var daemonType bool

func init() {
	vFlag := &flag.FlagSet{}
	vFlag.BoolVar(&daemonType, "D", false, "Run in daemon")
	err := vFlag.Parse(os.Args[1:])
	if err != nil {
		os.Exit(255)
	}
}

func main() {
	if daemonType {
		cmd := exec.Command(os.Args[0])
		cmd.Env = append(os.Environ(), "__Daemon=true")
		if err := cmd.Start(); err != nil {
			log.Fatalln(err)
		}
		return
	}
	if os.Getenv("__Daemon") == "true" {
		stdOut, err := os.OpenFile("/var/log/HelloTOSAPP.log", os.O_TRUNC|os.O_RDWR|os.O_CREATE, 0640)
		if err != nil {
			log.Fatalln(err)
		}
		defer stdOut.Close()
		os.Stdout = stdOut
		os.Stderr = stdOut
	}
	gin.SetMode(gin.ReleaseMode)
	route := gin.New()
	route.Use(gin.Recovery(), gin.Logger())

	g := route.Group("/TOS5_APP_HelloWorld")
	{
		g.GET("/", resp.WrapResp(func(c *gin.Context) (interface{}, error) {
			return "Hello TOS5 Application", nil
		}))

		g.GET("/welcome", resp.WrapResp(func(c *gin.Context) (interface{}, error) {
			return "Welcome, Developers!", nil
		}))
	}

	sockFile := "/var/api/TOS5_APP_HelloWorld.sock"
	go func() {
		ch := make(chan os.Signal)
		signal.Notify(ch, unix.SIGINT, unix.SIGTERM, unix.SIGQUIT, unix.SIGHUP)
		<-ch
		_ = os.Remove(sockFile)
		os.Exit(0)
	}()
	if err := route.RunUnix(sockFile); err != nil {
		log.Panicln(err)
	}
}
