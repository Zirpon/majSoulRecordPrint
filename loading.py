try:
    import pyi_splash
    # Update the text on the splash screen
    pyi_splash.update_text("loaded...")
    # Close the splash screen. It does not matter when the call
    # to this function is made, the splash screen remains open until
    # this function is called or the Python program is terminated.
    pyi_splash.close()
    pass
except ConnectionError or RuntimeError :
    # 异常时，执行该块
    pass
    
else:
    # 主代码块执行完，执行该块
    pyi_splash.close()
    pass
finally:
    pyi_splash.close()
    pass