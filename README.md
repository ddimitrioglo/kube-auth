## KubeAuth

<img src="https://raw.githack.com/ddimitrioglo/kube-auth/master/ext/img/icon-128.png"/>

#### An easy way to login into Kubernetes dashboard

### Description

The goal of this package (the combination of npm package and browser extension) is to provide an easier way
to login into Kubernetes dashboard on an Amazon EKS cluster then described on [Amazon's blog][5]

Previously you had to manually generate and paste the token from the CLI into the "Enter token box" and then choose "Sign in".

If you are lazy like me, then most probably you find it boring as heck 🥱, so what if you could configure it once
on your machine and forget about this routine 🤯? And yes, now you can do it!   

### Prerequisites

* Node.js v8+
* `aws-cli` installed & configured
* `kubectl` installed & configured

### Installation

* `npm install -g kube-auth`
* `kube-auth configure --browser chrome`
* Open `chrome://extensions/` page
* Enable developer mode
* Press "Load unpacked" and select the directory returned by a `kube-auth whereis` command
* Click on extension icon (browser extension bar) and fill Amazon EKS cluster information
* That's it!

### Todo

- [ ] Automatic [native host][3] generation for all browsers and OS'
- [ ] Get rid of `aws eks get-token` CLI command by using `aws-sdk` (see Python [example][1])
- [ ] Rewrite to `typescript`
- [ ] Use `webpack` for extension build
- [ ] Support Windows machines ([`regedit`][2] might needed)
- [ ] Use Mozilla's [polyfill][4] in order to support Chrome, Firefox, Opera & Edge 
- [ ] Get rid of `native-messaging` library (maybe...)
- [ ] Think about installing browser extension automatically (see [docs][6])
- [ ] Dynamically change the icon 
```javascript
  chrome.browserAction.setIcon({
    path: {
      128: 'img/some.png'
    }
  });
```

### Improvements

* If you are facing some issues, please don't hesitate to open an issue
* If you have any idea on how to improve this module, feel free to contribute or open an issue with `enhancement` label

We will get back to you as soon as possible.

### License

This repository can be used under the MIT license.

[1]: https://github.com/kubernetes-sigs/aws-iam-authenticator#api-authorization-from-outside-a-cluster
[2]: https://www.npmjs.com/package/regedit
[3]: https://developer.chrome.com/extensions/nativeMessaging#native-messaging-host-location
[4]: https://github.com/mozilla/webextension-polyfill
[5]: https://aws.amazon.com/ru/premiumsupport/knowledge-center/eks-cluster-kubernetes-dashboard/
[6]: https://developer.chrome.com/apps/external_extensions
