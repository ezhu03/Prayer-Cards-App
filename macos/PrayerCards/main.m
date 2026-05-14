#import <Cocoa/Cocoa.h>
#import <WebKit/WebKit.h>

@interface DragRegionView : NSView
@end

@implementation DragRegionView

- (BOOL)acceptsFirstMouse:(NSEvent *)event {
    return YES;
}

- (BOOL)mouseDownCanMoveWindow {
    return YES;
}

- (void)mouseDown:(NSEvent *)event {
    [self.window performWindowDragWithEvent:event];
}

@end

@interface AppDelegate : NSObject <NSApplicationDelegate, WKScriptMessageHandler, WKUIDelegate>
@property (strong) NSWindow *window;
@property (strong) WKWebView *webView;
@end

@implementation AppDelegate

- (void)applicationDidFinishLaunching:(NSNotification *)notification {
    [self configureMainMenu];

    WKUserContentController *userContentController = [[WKUserContentController alloc] init];
    [userContentController addScriptMessageHandler:self name:@"downloadCards"];
    [userContentController addScriptMessageHandler:self name:@"suggestVerseWithAI"];
    NSString *platformScriptSource =
        @"document.documentElement.classList.add('is-macos-app');"
         "document.addEventListener('DOMContentLoaded', function () {"
         "  document.body.classList.add('is-macos-app');"
         "});";
    WKUserScript *platformScript = [[WKUserScript alloc]
        initWithSource:platformScriptSource
         injectionTime:WKUserScriptInjectionTimeAtDocumentStart
      forMainFrameOnly:YES];
    [userContentController addUserScript:platformScript];

    WKWebViewConfiguration *configuration = [[WKWebViewConfiguration alloc] init];
    configuration.userContentController = userContentController;

    self.webView = [[WKWebView alloc] initWithFrame:NSZeroRect configuration:configuration];
    self.webView.UIDelegate = self;
    self.webView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
    self.webView.underPageBackgroundColor = NSColor.clearColor;
    [self.webView setValue:@NO forKey:@"drawsBackground"];

    self.window = [[NSWindow alloc]
        initWithContentRect:NSMakeRect(0, 0, 1120, 820)
                  styleMask:(NSWindowStyleMaskTitled |
                             NSWindowStyleMaskClosable |
                             NSWindowStyleMaskMiniaturizable |
                             NSWindowStyleMaskResizable |
                             NSWindowStyleMaskFullSizeContentView)
                    backing:NSBackingStoreBuffered
                      defer:NO];
    self.window.title = @"Prayer Cards";
    self.window.titleVisibility = NSWindowTitleHidden;
    self.window.titlebarAppearsTransparent = YES;
    self.window.movableByWindowBackground = NO;
    self.window.backgroundColor = NSColor.clearColor;
    self.window.opaque = NO;
    self.window.minSize = NSMakeSize(860, 680);

    NSView *containerView = [[NSView alloc] initWithFrame:NSMakeRect(0, 0, 1120, 820)];
    containerView.wantsLayer = YES;

    NSVisualEffectView *backgroundView = [[NSVisualEffectView alloc] initWithFrame:containerView.bounds];
    backgroundView.autoresizingMask = NSViewWidthSizable | NSViewHeightSizable;
    backgroundView.material = NSVisualEffectMaterialUnderWindowBackground;
    backgroundView.blendingMode = NSVisualEffectBlendingModeBehindWindow;
    backgroundView.state = NSVisualEffectStateActive;
    [containerView addSubview:backgroundView];

    self.webView.frame = containerView.bounds;
    [containerView addSubview:self.webView];

    CGFloat width = NSWidth(containerView.bounds);
    CGFloat height = NSHeight(containerView.bounds);
    CGFloat titlebarDragHeight = 18.0;

    DragRegionView *topDragRegionView = [[DragRegionView alloc] initWithFrame:NSMakeRect(0, height - titlebarDragHeight, width, titlebarDragHeight)];
    topDragRegionView.autoresizingMask = NSViewWidthSizable | NSViewMinYMargin;
    [containerView addSubview:topDragRegionView];

    [self.window center];
    self.window.contentView = containerView;
    [self.window makeKeyAndOrderFront:nil];

    NSURL *webDirectory = [[[NSBundle mainBundle] resourceURL] URLByAppendingPathComponent:@"web" isDirectory:YES];
    NSURL *indexURL = [webDirectory URLByAppendingPathComponent:@"index.html"];
    [self.webView loadFileURL:indexURL allowingReadAccessToURL:webDirectory];
}

- (void)configureMainMenu {
    NSMenu *mainMenu = [[NSMenu alloc] initWithTitle:@""];

    NSMenuItem *appMenuItem = [[NSMenuItem alloc] initWithTitle:@"" action:nil keyEquivalent:@""];
    [mainMenu addItem:appMenuItem];

    NSMenu *appMenu = [[NSMenu alloc] initWithTitle:@"Prayer Cards"];
    [appMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Quit Prayer Cards" action:@selector(terminate:) keyEquivalent:@"q"]];
    appMenuItem.submenu = appMenu;

    NSMenuItem *editMenuItem = [[NSMenuItem alloc] initWithTitle:@"" action:nil keyEquivalent:@""];
    [mainMenu addItem:editMenuItem];

    NSMenu *editMenu = [[NSMenu alloc] initWithTitle:@"Edit"];
    [editMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Undo" action:@selector(undo:) keyEquivalent:@"z"]];
    [editMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Redo" action:@selector(redo:) keyEquivalent:@"Z"]];
    [editMenu addItem:[NSMenuItem separatorItem]];
    [editMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Cut" action:@selector(cut:) keyEquivalent:@"x"]];
    [editMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Copy" action:@selector(copy:) keyEquivalent:@"c"]];
    [editMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Paste" action:@selector(paste:) keyEquivalent:@"v"]];
    [editMenu addItem:[NSMenuItem separatorItem]];
    [editMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Select All" action:@selector(selectAll:) keyEquivalent:@"a"]];
    editMenuItem.submenu = editMenu;

    NSMenuItem *fileMenuItem = [[NSMenuItem alloc] initWithTitle:@"" action:nil keyEquivalent:@""];
    [mainMenu addItem:fileMenuItem];

    NSMenu *fileMenu = [[NSMenu alloc] initWithTitle:@"File"];
    [fileMenu addItem:[self menuItemWithTitle:@"New Card" action:@selector(newCard:) keyEquivalent:@"n"]];
    [fileMenu addItem:[self menuItemWithTitle:@"Import Cards..." action:@selector(importCards:) keyEquivalent:@"i"]];
    [fileMenu addItem:[self menuItemWithTitle:@"Export Cards..." action:@selector(exportCards:) keyEquivalent:@"e"]];
    [fileMenu addItem:[NSMenuItem separatorItem]];
    [fileMenu addItem:[self menuItemWithTitle:@"Close Window" action:@selector(closeWindow:) keyEquivalent:@"w"]];
    fileMenuItem.submenu = fileMenu;

    NSMenuItem *viewMenuItem = [[NSMenuItem alloc] initWithTitle:@"" action:nil keyEquivalent:@""];
    [mainMenu addItem:viewMenuItem];

    NSMenu *viewMenu = [[NSMenu alloc] initWithTitle:@"View"];
    [viewMenu addItem:[self menuItemWithTitle:@"Open Menu and Search" action:@selector(openMenu:) keyEquivalent:@"f"]];
    [viewMenu addItem:[self menuItemWithTitle:@"Start Timed Prayer" action:@selector(startTimedPrayer:) keyEquivalent:@"t"]];
    [viewMenu addItem:[self menuItemWithTitle:@"Close Overlay" action:@selector(closeOverlay:) keyEquivalent:@"\e"]];
    viewMenuItem.submenu = viewMenu;

    NSMenuItem *windowMenuItem = [[NSMenuItem alloc] initWithTitle:@"" action:nil keyEquivalent:@""];
    [mainMenu addItem:windowMenuItem];

    NSMenu *windowMenu = [[NSMenu alloc] initWithTitle:@"Window"];
    [windowMenu addItem:[[NSMenuItem alloc] initWithTitle:@"Minimize" action:@selector(performMiniaturize:) keyEquivalent:@"m"]];
    windowMenuItem.submenu = windowMenu;
    NSApp.windowsMenu = windowMenu;

    NSApp.mainMenu = mainMenu;
}

- (NSMenuItem *)menuItemWithTitle:(NSString *)title action:(SEL)action keyEquivalent:(NSString *)keyEquivalent {
    NSMenuItem *item = [[NSMenuItem alloc] initWithTitle:title action:action keyEquivalent:keyEquivalent];
    item.target = self;
    return item;
}

- (void)runAppCommand:(NSString *)command {
    NSData *jsonData = [NSJSONSerialization dataWithJSONObject:@[command] options:0 error:nil];
    if (jsonData == nil) return;

    NSString *json = [[NSString alloc] initWithData:jsonData encoding:NSUTF8StringEncoding];
    if (json.length < 2) return;

    NSString *argument = [json substringWithRange:NSMakeRange(1, json.length - 2)];
    NSString *script = [NSString stringWithFormat:@"window.prayerCardsCommand && window.prayerCardsCommand(%@);", argument];
    [self.webView evaluateJavaScript:script completionHandler:nil];
}

- (void)newCard:(id)sender {
    [self runAppCommand:@"new-card"];
}

- (void)openMenu:(id)sender {
    [self runAppCommand:@"open-menu"];
}

- (void)startTimedPrayer:(id)sender {
    [self runAppCommand:@"timed-prayer"];
}

- (void)exportCards:(id)sender {
    [self runAppCommand:@"export"];
}

- (void)importCards:(id)sender {
    [self runAppCommand:@"import"];
}

- (void)closeOverlay:(id)sender {
    [self runAppCommand:@"close-overlay"];
}

- (void)closeWindow:(id)sender {
    [self.window performClose:sender];
}

- (BOOL)applicationShouldTerminateAfterLastWindowClosed:(NSApplication *)sender {
    return YES;
}

- (void)webView:(WKWebView *)webView
runJavaScriptAlertPanelWithMessage:(NSString *)message
initiatedByFrame:(WKFrameInfo *)frame
completionHandler:(void (^)(void))completionHandler {
    NSAlert *alert = [[NSAlert alloc] init];
    alert.messageText = message.length ? message : @"Prayer Cards";
    [alert addButtonWithTitle:@"OK"];
    [alert beginSheetModalForWindow:self.window completionHandler:^(__unused NSModalResponse returnCode) {
        completionHandler();
    }];
}

- (void)webView:(WKWebView *)webView
runJavaScriptConfirmPanelWithMessage:(NSString *)message
initiatedByFrame:(WKFrameInfo *)frame
completionHandler:(void (^)(BOOL result))completionHandler {
    NSAlert *alert = [[NSAlert alloc] init];
    alert.messageText = message.length ? message : @"Are you sure?";
    [alert addButtonWithTitle:@"Reset"];
    [alert addButtonWithTitle:@"Cancel"];
    alert.alertStyle = NSAlertStyleWarning;
    [alert beginSheetModalForWindow:self.window completionHandler:^(NSModalResponse returnCode) {
        completionHandler(returnCode == NSAlertFirstButtonReturn);
    }];
}

- (void)userContentController:(WKUserContentController *)userContentController
      didReceiveScriptMessage:(WKScriptMessage *)message {
    if ([message.name isEqualToString:@"suggestVerseWithAI"] && [message.body isKindOfClass:[NSDictionary class]]) {
        [self suggestVerseWithAI:(NSDictionary *)message.body];
        return;
    }

    if (![message.name isEqualToString:@"downloadCards"] || ![message.body isKindOfClass:[NSDictionary class]]) {
        return;
    }

    NSDictionary *body = (NSDictionary *)message.body;
    NSString *filename = body[@"filename"];
    NSString *payload = body[@"payload"];

    if (![filename isKindOfClass:[NSString class]] || ![payload isKindOfClass:[NSString class]]) {
        return;
    }

    NSSavePanel *panel = [NSSavePanel savePanel];
    panel.nameFieldStringValue = filename;
    panel.canCreateDirectories = YES;

    if ([panel runModal] == NSModalResponseOK && panel.URL != nil) {
        NSError *error = nil;
        [payload writeToURL:panel.URL atomically:YES encoding:NSUTF8StringEncoding error:&error];
        if (error != nil) {
            NSBeep();
        }
    }
}

- (NSString *)trimmedSecret:(NSString *)secret {
    if (![secret isKindOfClass:[NSString class]]) {
        return @"";
    }

    return [secret stringByTrimmingCharactersInSet:NSCharacterSet.whitespaceAndNewlineCharacterSet];
}

- (NSString *)openAIAPIKey {
    NSString *environmentKey = [self trimmedSecret:NSProcessInfo.processInfo.environment[@"OPENAI_API_KEY"]];
    if (environmentKey.length > 0) {
        return environmentKey;
    }

    NSString *keyPath = [@"~/.prayer-cards-openai-key" stringByExpandingTildeInPath];
    NSString *fileKey = [NSString stringWithContentsOfFile:keyPath encoding:NSUTF8StringEncoding error:nil];
    return [self trimmedSecret:fileKey];
}

- (void)suggestVerseWithAI:(NSDictionary *)body {
    NSString *apiKey = [self openAIAPIKey];
    if (apiKey.length == 0) {
        return;
    }

    NSString *requestId = body[@"requestId"];
    NSString *note = body[@"note"];
    NSArray *usedReferences = body[@"usedReferences"];
    NSArray *candidates = body[@"candidates"];

    if (![requestId isKindOfClass:[NSString class]] ||
        ![note isKindOfClass:[NSString class]] ||
        ![candidates isKindOfClass:[NSArray class]] ||
        candidates.count == 0) {
        return;
    }

    NSMutableArray<NSString *> *candidateLines = [NSMutableArray array];
    for (NSDictionary *candidate in candidates) {
        if (![candidate isKindOfClass:[NSDictionary class]]) continue;
        NSString *reference = candidate[@"reference"];
        NSString *category = candidate[@"category"];
        NSString *text = candidate[@"text"];
        NSArray *keywords = candidate[@"keywords"];
        if (![reference isKindOfClass:[NSString class]]) continue;
        NSString *categoryText = [category isKindOfClass:[NSString class]] && category.length ? category : @"general";
        NSString *verseText = [text isKindOfClass:[NSString class]] ? text : @"";

        NSMutableArray<NSString *> *keywordStrings = [NSMutableArray array];
        if ([keywords isKindOfClass:[NSArray class]]) {
            for (id keyword in keywords) {
                if ([keyword isKindOfClass:[NSString class]] && [keyword length] > 0) {
                    [keywordStrings addObject:keyword];
                }
            }
        }

        NSString *keywordText = keywordStrings.count ? [keywordStrings componentsJoinedByString:@", "] : @"general";
        [candidateLines addObject:[NSString stringWithFormat:@"- %@ (%@): keywords: %@; text: %@", reference, categoryText, keywordText, verseText]];
    }

    NSString *usedText = [usedReferences isKindOfClass:[NSArray class]] ? [usedReferences componentsJoinedByString:@", "] : @"";
    NSString *input = [NSString stringWithFormat:
        @"Prayer request: %@\n\nAlready used verse references: %@\n\nCandidate verse references:\n%@\n\nChoose the single best candidate reference for this prayer request. Do not choose an already used reference. Return only JSON that matches the schema.",
        note,
        usedText.length ? usedText : @"none",
        [candidateLines componentsJoinedByString:@"\n"]];

    NSString *model = NSProcessInfo.processInfo.environment[@"OPENAI_MODEL"];
    if (![model isKindOfClass:[NSString class]] || model.length == 0) {
        model = @"gpt-4.1-mini";
    }

    NSDictionary *schema = @{
        @"type": @"object",
        @"additionalProperties": @NO,
        @"required": @[ @"reference" ],
        @"properties": @{
            @"reference": @{
                @"type": @"string",
                @"description": @"One exact verse reference from the provided candidate list."
            }
        }
    };

    NSDictionary *requestBody = @{
        @"model": model,
        @"store": @NO,
        @"instructions": @"You are selecting one Bible verse reference for a prayer card. Choose only from the provided candidate list. Do not invent references or quote verse text.",
        @"input": input,
        @"max_output_tokens": @80,
        @"text": @{
            @"format": @{
                @"type": @"json_schema",
                @"name": @"verse_choice",
                @"strict": @YES,
                @"schema": schema
            }
        }
    };

    NSError *jsonError = nil;
    NSData *requestData = [NSJSONSerialization dataWithJSONObject:requestBody options:0 error:&jsonError];
    if (requestData == nil) return;

    NSMutableURLRequest *request = [NSMutableURLRequest requestWithURL:[NSURL URLWithString:@"https://api.openai.com/v1/responses"]];
    request.HTTPMethod = @"POST";
    request.HTTPBody = requestData;
    [request setValue:@"application/json" forHTTPHeaderField:@"Content-Type"];
    [request setValue:[NSString stringWithFormat:@"Bearer %@", apiKey] forHTTPHeaderField:@"Authorization"];

    NSURLSessionDataTask *task = [NSURLSession.sharedSession dataTaskWithRequest:request
                                                               completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
        if (data == nil || error != nil) return;

        NSDictionary *responseObject = [NSJSONSerialization JSONObjectWithData:data options:0 error:nil];
        if (![responseObject isKindOfClass:[NSDictionary class]]) return;

        NSString *outputText = [self outputTextFromOpenAIResponse:responseObject];
        if (outputText.length == 0) return;

        NSData *outputData = [outputText dataUsingEncoding:NSUTF8StringEncoding];
        NSDictionary *choice = [NSJSONSerialization JSONObjectWithData:outputData options:0 error:nil];
        NSString *reference = [choice isKindOfClass:[NSDictionary class]] ? choice[@"reference"] : nil;
        if (![reference isKindOfClass:[NSString class]] || reference.length == 0) return;

        NSDictionary *callbackPayload = @{
            @"requestId": requestId,
            @"note": note,
            @"reference": reference
        };
        NSData *callbackData = [NSJSONSerialization dataWithJSONObject:callbackPayload options:0 error:nil];
        if (callbackData == nil) return;
        NSString *callbackJSON = [[NSString alloc] initWithData:callbackData encoding:NSUTF8StringEncoding];
        if (callbackJSON.length == 0) return;

        dispatch_async(dispatch_get_main_queue(), ^{
            NSString *script = [NSString stringWithFormat:@"window.prayerCardsReceiveAIVerse && window.prayerCardsReceiveAIVerse(%@);", callbackJSON];
            [self.webView evaluateJavaScript:script completionHandler:nil];
        });
    }];
    [task resume];
}

- (NSString *)outputTextFromOpenAIResponse:(NSDictionary *)responseObject {
    NSString *outputText = responseObject[@"output_text"];
    if ([outputText isKindOfClass:[NSString class]] && outputText.length > 0) {
        return outputText;
    }

    NSMutableString *combined = [NSMutableString string];
    NSArray *output = responseObject[@"output"];
    if (![output isKindOfClass:[NSArray class]]) return @"";

    for (NSDictionary *item in output) {
        if (![item isKindOfClass:[NSDictionary class]]) continue;
        NSArray *content = item[@"content"];
        if (![content isKindOfClass:[NSArray class]]) continue;

        for (NSDictionary *part in content) {
            if (![part isKindOfClass:[NSDictionary class]]) continue;
            NSString *text = part[@"text"];
            if ([text isKindOfClass:[NSString class]]) {
                [combined appendString:text];
            }
        }
    }

    return combined;
}

- (void)webView:(WKWebView *)webView
runOpenPanelWithParameters:(WKOpenPanelParameters *)parameters
initiatedByFrame:(WKFrameInfo *)frame
completionHandler:(void (^)(NSArray<NSURL *> * _Nullable URLs))completionHandler {
    NSOpenPanel *panel = [NSOpenPanel openPanel];
    panel.allowsMultipleSelection = parameters.allowsMultipleSelection;
    panel.canChooseDirectories = parameters.allowsDirectories;
    panel.canChooseFiles = YES;

    if ([panel runModal] == NSModalResponseOK) {
        completionHandler(panel.URLs);
    } else {
        completionHandler(nil);
    }
}

@end

int main(int argc, const char * argv[]) {
    @autoreleasepool {
        NSApplication *app = [NSApplication sharedApplication];
        AppDelegate *delegate = [[AppDelegate alloc] init];
        app.delegate = delegate;
        [app setActivationPolicy:NSApplicationActivationPolicyRegular];
        [app activateIgnoringOtherApps:YES];
        [app run];
    }

    return 0;
}
